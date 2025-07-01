import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            req.userId = decoded.userId;
            next();
            } catch (err) {
                res.status(401).json({success:false,message:err.message});
            }
}

export default authUser;