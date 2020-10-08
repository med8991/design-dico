import { from, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RezoService } from '../../rezo.service';
import {NgForm} from '@angular/forms'



@Component({
  selector: 'app-basicelements',
  templateUrl: './basicelements.component.html',
  styleUrls: ['./basicelements.component.scss']
})
export class BasicelementsComponent implements OnInit {
  
  public definition : String ; 
  public search : any = [] ;
  public articles : string;
  mots : myObject ; 
  public myid : String =null; 
  public node = [] ;
  public relation : String ;
  isAvailable = false ; 
  public error :String;
  public myword : String;

  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];

  constructor(private Reso : RezoService ,private http : HttpClient) { }

  searchWord(mot  : String){
    console.log("haha")
    this.onSubmit(mot)

  }
  
  test(){
    console.log(this.myword);
  }

  onSubmit(entry : String) {
   
    this.relation = null;
    this.isAvailable = false ; 
    
    
    this.definition = "";
    this.node = [];
    var myobject = {
      name : "",
      def : "",
      node : "",
      relation : ""
    };
    this.articles  = "";  
    
    let name = document.getElementById("name");
    console.log(this.myword);

    if(this.myword == null){
      console.log("Veuillez saisir un mot");
    }else{

      let varsend ;
      if(typeof entry === 'string' && this.myword.length == 0 ){
       varsend = entry;
      }else{
        varsend = this.myword;
      }
      // this.spinner.show();
      this.Reso.getWords(varsend).subscribe((reponse) => {
        
        if(typeof reponse === 'string'){
          console.log("no things");
          this.error = reponse;
          this.isAvailable = true; 
        }else{
          this.definition = reponse.definition;
          this.relation = reponse.relation_sortant ; 
        }
      // setTimeout(() => {
      //   this.spinner.hide();
      // },2000);
 
       
      },(error) => {
       console.log("Error");
     });
    }
   
    this.myid ="";
}


  ngOnInit() : void  {

  
  }


  
  


}

interface myObject{
   definition : String ; 
   

}
