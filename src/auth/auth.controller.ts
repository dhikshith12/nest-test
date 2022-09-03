import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){

    }
    // POST /auth/signup
    @Post('signup')
    signup(@Body() dto: AuthDto){
        console.log("sign up", {
           dto 
        });
        return this.authService.signup(dto);
    }
    // POST /auth/signin
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto){
        console.log("sign in", {
            dto
        });
        return this.authService.signin(dto);
    }
}