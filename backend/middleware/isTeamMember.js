export const isTeamMember = (req, res, next) => {
  if (req.user && req.user.userRole === 'team') {
    return next();
  }
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Team members only.' 
  });
};