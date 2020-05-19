class CatchBlock {
    constructor(){
        this.hold
    }

    hold(err, next){
        if( !err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
}

export const Catch = new CatchBlock().hold;