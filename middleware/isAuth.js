import jwt from 'jsonwebtoken';

export class IsAuth {
    constructor(){
        this.verifyAuth;
        this.VoteAuth;
    }

    verifyAuth(req, res, next){
        const authHeader = req.get('Authorization') || req.headers['x-access-token'] || req.headers['Authorization'];

        if (!authHeader) {
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        let decodedToken; 

        try {
            decodedToken = jwt.verify(token, 'easypayapisupersecrete');
        } catch (err) {
            err.statusCode = 500;
            throw err;
        }
        if (!decodedToken) {
            const error = new Error('Not Authenticated');
            error.statusCode = 401;
            throw error;
        }
    
        req.userId = decodedToken.userId;
        req.userRole = decodedToken.userRole;

        next();
    }

    VoteAuth(req, res, next){
        const authHeader = req.get('Authorization') || req.headers['x-access-token'] || req.headers['Authorization'];

        if (!authHeader) {
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        let decodedToken; 

        try {
            decodedToken = jwt.verify(token, 'easypayapisupersecrete');
        } catch (err) {
            err.statusCode = 500;
            throw err;
        }
        if (!decodedToken) {
            const error = new Error('Not Authenticated');
            error.statusCode = 401;
            throw error;
        }
    
        req.voter_pin_id = decodedToken.voter_pin_id;

        next();
    }
}

