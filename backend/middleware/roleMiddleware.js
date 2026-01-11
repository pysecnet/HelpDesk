export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Student access only" });
  next();
};

export const adminOrDepartment = (req, res, next) => {
  if (!["admin", "department"].includes(req.user.role))
    return res.status(403).json({ message: "Access denied" });
  next();
};
