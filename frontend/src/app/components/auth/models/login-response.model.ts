import { UserModel } from "./user.model";

// Giriş ve Kayıt işlemlerinde dönen sonuçları tutan model
// İşlem sonrasında kullanıcının kişisel bilgileri ve token bilgisi dönecek ve ardından bu bilgileri localStorage'a kaydedeceğiz.
export class LoginResponseModel{
  token: string = "";
  user: UserModel = new UserModel();
}
