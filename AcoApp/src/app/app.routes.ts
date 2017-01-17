import {LoginPage} from '../pages/login/login';
import {ProfilPage} from '../pages/profil/profil';
import {FormPage} from '../pages/form/form';



export class Routes {
  static LOGIN: string="login";
  static PROFIL: string="profil";
  static FORM: string="form";



  static pages = {
    [Routes.LOGIN]: LoginPage,
    [Routes.PROFIL]: ProfilPage,
    [Routes.FORM]: FormPage,
  
  };


  static getPage(id){
    const route = Routes.pages[id];
    return route;
  }

  static getRootPage(){
    let root = Routes.getPage(Routes.LOGIN);
    return root;
  }

  static getPages(){
    const pages = []
    for (var key in Routes.pages) {
      pages.push(Routes.pages[key]);
  }

  return pages;
  }

  static getDeepLinkerConfig(){
    const config = {links:[]}
    for (var key in Routes.pages) {
      config.links.push({ component: Routes.pages[key], name: key});
    }

    console.log('test/////',config)
    return config;
  }

}
