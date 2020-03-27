export class GetSetupVote {
    constructor(){
        this.getFirstPage;
    }

    getFirstPage(req, res, next){
        return res.status(200).json({
            message: 'Welcome set up votes'
        });
    }
}