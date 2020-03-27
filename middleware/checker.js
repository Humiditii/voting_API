import express from 'express';
const app = express();
class validation {

    constructor(){
        this.mail;
        this.password;
        this.number;
        this.failed;
        this.fieldTest
    }
//
    failed(param){
       return app.use((err,req,res,next) => {
             res.status().json({
                 message: param
             })
         });
    }

    mail(email){

        let passed = {
            type:null,
            validate: null,
        }; 

        if (typeof email !== 'string') {
            passed.type = 'error';
            passed.validate = 'Email should be string';
            this.failed(passed)
        }else {

            if (email.length < 6) {
                passed.type = 'error';
                passed.validate = 'Email should not be less than six characters';
                this.failed(passed)
            }else{
                const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(pattern.test(email) == false){
                   passed.type= 'error';
                   passed.validate = 'supplied mail does not match the required pattern';
                   this.failed(passed);
            }else{
                passed.type = 'success';
                passed.validate = email;
                return passed
            }
        }
    }}

    fieldTest(param){
        const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(pattern.test(param) == false){
                  const field = 'username'
                  return field;
            }else{
                const field = 'email'
                return field;
    
            }
    }
    
}

export const Validate = new validation();
//Validate.mail('humiditii45@gmail.com');
