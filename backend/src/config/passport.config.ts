import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./app.config";
import { NotFoundException, BadRequestException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider";
import { 
  loginOrCreateAccountService, 
  verifyUserService,
  findUserByEmailService
} from "../services/auth.service";
import AccountModel from "../models/account.model"; // Import AccountModel yang benar


// Strategy untuk Google Register
passport.use(
  'google-register',
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      // PERBAIKAN: Tambahkan /callback
      callbackURL: `${config.GOOGLE_CALLBACK_URL}/callback/register`,
      scope: ["profile", "email"],
      passReqToCallback: true,
    }, 
    async(req: Request, accessToken, refreshToken, profile, done) => {
            try {
        const {email, sub: googleId, picture} = profile._json;
        
        // Validasi email dan googleId
        if (!email) {
          return done(new BadRequestException("Email is required"), false);
        }
        
        if (!googleId) {
          return done(new NotFoundException('Google ID (sub) is Missing'), false);
        }

        // Cek apakah user sudah ada
        const existingUser = await findUserByEmailService(email);
        if (existingUser) {
          return done(null, false, { message: "Email already exists. Please login instead." });
        }

        // Buat user baru
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Strategy untuk Google Login
passport.use( 
  'google-login',
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      // PERBAIKAN: Tambahkan /callback  
      callbackURL: `${config.GOOGLE_CALLBACK_URL}/callback/login`,
      scope: ["profile", "email"],
      passReqToCallback: true,
    }, 
    async(req: Request, accessToken, refreshToken, profile, done) => {
        try {
        const {email, sub: googleId, picture} = profile._json;
        
        // Validasi email dan googleId
        if (!email) {
          return done(new BadRequestException("Email is required"), false);
        }
        
        if (!googleId) {
          return done(new NotFoundException('Google ID (sub) is Missing'), false);
        }

        // Cari user yang sudah ada
        const existingUser = await findUserByEmailService(email);
        if (!existingUser) {
          return done(null, false, { message: "No account found with this email. Please register first." });
        }

        // Cek apakah user memiliki akun Google
        // PERBAIKAN: Gunakan AccountModel, bukan UserModel
        const googleAccount = await AccountModel.findOne({
          userId: existingUser._id,
          provider: ProviderEnum.GOOGLE,
          providerId: googleId
        });

        if (!googleAccount) {
          return done(null, false, { message: "This email is registered with a different method. Please use your password to login." });
        }

        done(null, existingUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  session: true,
  },
    async( email, password, done) =>{
      try {
         const user = await verifyUserService({ email, password});
         return done(null, user)
      } catch (error: any) {
        return done(error, false, { message: error?.message});
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// import passport from "passport";
// import { Request } from "express";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as LocalStrategy } from "passport-local";
// import { config } from "./app.config";
// import { NotFoundException } from "../utils/appError";
// import { ProviderEnum } from "../enums/account-provider";
// import { 
//   loginOrCreateAccountService, 
//   verifyUserService,
//   findUserByEmailService
// } from "../services/auth.service";
// import UserModel from "../models/user.model";

// // Strategy untuk Google Register
// passport.use(
//   'google-register',
//   new GoogleStrategy(
//     {
//       clientID: config.GOOGLE_CLIENT_ID,
//       clientSecret: config.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${config.GOOGLE_CALLBACK_URL}/register`, // Callback khusus register
//       scope: ["profile", "email"],
//       passReqToCallback: true,
//     }, 
//     async(req: Request, accessToken, refreshToken, profile, done) => {
//       try {
//         const {email, sub: googleId, picture} = profile._json;
        
//         if (!googleId) {
//           throw new NotFoundException('Google ID (sub) is Missing');
//         }

//         // Cek apakah user sudah ada
//         const existingUser = await findUserByEmailService(email);
//         if (existingUser) {
//           return done(null, false, { message: "Email already exists. Please login instead." });
//         }

//         // Buat user baru
//         const { user } = await loginOrCreateAccountService({
//           provider: ProviderEnum.GOOGLE,
//           displayName: profile.displayName,
//           providerId: googleId,
//           picture: picture,
//           email: email,
//         });
        
//         done(null, user);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );

// // Strategy untuk Google Login
// passport.use(
//   'google-login',
//   new GoogleStrategy(
//     {
//       clientID: config.GOOGLE_CLIENT_ID,
//       clientSecret: config.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${config.GOOGLE_CALLBACK_URL}/login`, // Callback khusus login
//       scope: ["profile", "email"],
//       passReqToCallback: true,
//     }, 
//     async(req: Request, accessToken, refreshToken, profile, done) => {
//       try {
//         const {email, sub: googleId, picture} = profile._json;
        
//         if (!googleId) {
//           throw new NotFoundException('Google ID (sub) is Missing');
//         }

//         // Cari user yang sudah ada
//         const existingUser = await findUserByEmailService(email);
//         if (!existingUser) {
//           return done(null, false, { message: "No account found with this email. Please register first." });
//         }

//         // Cek apakah user memiliki akun Google
//         const googleAccount = await UserModel.findOne({
//           userId: existingUser._id,
//           provider: ProviderEnum.GOOGLE,
//           providerId: googleId
//         });

//         if (!googleAccount) {
//           return done(null, false, { message: "This email is registered with a different method. Please use your password to login." });
//         }

//         done(null, existingUser);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );

// // Local strategy tetap sama
// passport.use(new LocalStrategy({
//   usernameField: "email",
//   passwordField: "password",
//   session: true,
//   },
//     async( email, password, done) =>{
//       try {
//          const user = await verifyUserService({ email, password});
//          return done(null, user)
//       } catch (error: any) {
//         return done(error, false, { message: error?.message});
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done) => done(null, user));
// passport.deserializeUser((user: any, done) => done(null, user));