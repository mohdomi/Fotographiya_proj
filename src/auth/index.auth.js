import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: "No valid token sent." });
    }

    const verified = jwt.verify(token, "some random password for jwt.");

    if (!verified) {
      return res.status(403).json({ message: "Not a valid token." });
    }
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.error("Error in authMiddleware", error);
    res.status(403).json({ message: "Authentication failed." });
  }
};

export default authMiddleware;