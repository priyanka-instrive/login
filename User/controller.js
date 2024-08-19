const bcrypt = require("bcrypt");
const userService = require("./service");

const failures = {};
const BLOCK_TIME = 1 * 60 * 1000; // 1 minute block time
const ONE_MINUTE = 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

const MAX_ATTEMPTS = 5;

const registerUser = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    const existingUser = await userService.findUser(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email is duplicate" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const newUser = await userService.create(user);

    const result = {
      message: "User registered successfully",
      detail: newUser,
    };
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

function login(req, res) {
  const remoteIp = req.ip;
  const f = failures[remoteIp];

  if (f && f.isBlocked && Date.now() < f.blockUntil) {
    return res
      .status(403)
      .json({ message: "Account is temporarily locked. Try again later." });
  }

  // Proceed with login process
  const { email, password } = req.body;
  userService
    .getUserByEmail(email)
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        onLoginFail(remoteIp);
        return res.status(401).json({ message: "Invalid email or password" });
      }

      onLoginSuccess(remoteIp);
      return res.status(200).json({ message: "Login successful" });
    })
    .catch((err) => {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    });
}

function onLoginFail(remoteIp) {
  const now = Date.now();
  let f = failures[remoteIp];
  if (f && now - f.lastAttempt < ONE_MINUTE) {
    f.count += 1;
  } else if (f && now - f.lastAttempt >= FIVE_MINUTES) {
    // If the user took a break of 5 minutes or more, reset the counter
    f.count = 1;
  } else {
    // First failure or a new session of failures
    f = { count: 1, isBlocked: false };
  }

  f.lastAttempt = now;

  if (f.count >= MAX_ATTEMPTS && now - f.firstAttempt < ONE_MINUTE) {
    // Block the user for 1 minute after 5 failed attempts within 1 minute
    f.isBlocked = true;
    f.blockUntil = now + BLOCK_TIME;
    f.count = 0; // Reset the count after blocking
  } else if (f.count === 1) {
    f.firstAttempt = now; // Track the time of the first failed attempt in a new series
  }

  failures[remoteIp] = f;
}

function onLoginSuccess(remoteIp) {
  delete failures[remoteIp];
}

// Clean up old entries (people that have given up)
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
const FAILURE_EXPIRY = 10 * 60 * 1000; // 10 minutes

setInterval(function () {
  const now = Date.now();
  for (const ip in failures) {
    if (now - failures[ip].lastAttempt > FAILURE_EXPIRY) {
      delete failures[ip];
    }
  }
}, CLEANUP_INTERVAL);

module.exports = {
  login,
  registerUser,
};
