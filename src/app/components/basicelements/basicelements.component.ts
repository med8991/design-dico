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
  public myid : String =null; 
  public node = [] ;
  public relation = [] ;
  isAvailable = false ; 
  public error :String;
  public myword : String;
  public show : boolean ;
  public raffinement : [] ; 
  public isnotfind : boolean;
  public message : String;
  public otherDef : String ;
  public element = [];
  public association = [];

  constructor(private Reso : RezoService ,private http : HttpClient) { }

  searchWord(mot : String){
    console.log("ici");
    this.onSubmit(mot);

  }
  onSubmit(entry : String) {
    console.log(entry)
    this.initVar();
    this.message = this.myword; 
    console.log(this.myword);

    if(this.myword == null){
      console.log("Veuillez saisir un mot");
    }else{
      this.isAvailable = true ; 
      let varsend ;
      if(typeof entry == 'string' && this.myword.length == 0 ){
        console.log("dehors")
       varsend = entry;
      }else{
        console.log("dedans")
        varsend = this.myword;
      }
      let fromCache = this.getLocalStorage( varsend.toString());
      if(fromCache != null){
        this.definition = fromCache.definition;
        this.otherDef = fromCache.otherDef;
        this.relation = fromCache.relation_sortant;
        for(let i = 0 ; i < this.relation.length ; i++){
          if(this.relation[i].type == 0 ){
            let word = {"name" : "","type":0};
            word.name = this.relation[i].relation;
            this.association.push(word);
            }
        }
        console.log(this.association);
          if(this.otherDef.length > 0 ){
          this.element = this.otherDef.split("//DEF//");  
          }
        this.relation = fromCache.relation_sortant ; 
        this.isAvailable = false;
        this.show = true;
        this.raffinement = fromCache.Raffinement;
      }else{

      this.Reso.getWords(varsend).subscribe((reponse) => {
        
        if(typeof reponse === 'string'){
          console.log("no things");
          this.error = reponse;
          this.isAvailable = false;
          this.isnotfind = true;
        }else{
          this.definition = reponse.definition;
          this.relation = reponse.relation_sortant ; 
          for(let i = 0 ; i < this.relation.length ; i++){
            if(this.relation[i].type == 0 ){
              let word = {"name" : "","type":0};
              word.name = this.relation[i].relation;
              this.association.push(word);
              }
          }
          this.isAvailable = false;
          this.show = true;
          this.raffinement = reponse.Raffinement;
          this.otherDef = reponse.otherDef;
          //console.log(this.otherDef)
          if(this.otherDef.length > 0 ){
          this.element = this.otherDef.split("//DEF//");
          
          }
          localStorage.setItem(this.myword.toString(), JSON.stringify(reponse));
        }

      },(error) => {
       alert("Impossible de contacter le serveur");
       this.isAvailable  = false;
      });
      }
    }
   
    this.myword ="";
}


  ngOnInit() : void  {
    this.show = false;
    this.isAvailable = false; 
    this.isnotfind = false;
    this.definition = "";
    this.node = [];
    this.element = [];
    
  }
  

  initVar() : void {
    this.definition ="";
    this.error="";
    this.articles  = "";  
    this.show = false;
    this.relation = null;
    this.isnotfind = false;
    this.element = [];  
    this.association = [];
  }

  getLocalStorage(word : string){
    let usercache = JSON.parse(localStorage.getItem(word));
    return usercache;
  }
  

}

