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
  public show : boolean ;
  public isnotfind : boolean;
  public message : String;

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
    this.show = false;
    this.relation = null;
    this.isAvailable = true ; 
    this.isnotfind = false;
    this.message = this.myword;
    
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
      this.Reso.getWords(varsend).subscribe((reponse) => {
        
        if(typeof reponse === 'string'){
          console.log("no things");
          this.error = reponse;
          this.isAvailable = false;
          this.isnotfind = true;
        }else{
          this.definition = reponse.definition;
          this.relation = reponse.relation_sortant ; 
          this.isAvailable = false;
          this.show = true;

        }

      },(error) => {
       console.log("Error");
     });
    }
   
    this.myid ="";
}


  ngOnInit() : void  {
    this.show = false;
    this.isAvailable = false; 
    this.isnotfind = false;
  }


  
  


}

interface myObject{
   definition : String ; 
   

}
