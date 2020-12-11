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
  
  public ispressed : boolean ; 
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
  public raffinementMorph : [] ; 
  public isnotfind : boolean;
  public message : String;
  public otherDef : String ;
  public element = [];
  public association = [];
  public fromrelation : boolean = false ;
  public allType : [];  
  public nombre_raff_semantique : number ; 
  public nombre_raff_morphologique : number ; 
  public showing_relation : number ; 
  constructor(private Reso : RezoService ,private http : HttpClient) { }

  searchWord(mot : String){
    this.fromrelation = true ; 
    this.onSubmit(mot);

  }
  onSubmit(entry : String) {
    console.log(entry)
    this.initVar();
    this.message = this.myword; 

    if(this.myword == null){
      console.log("Veuillez saisir un mot");
    }else{
      this.isAvailable = true ; 
      let varsend ;
      if(typeof entry == 'string' && this.fromrelation == true ){
        varsend = entry;
        this.myword = entry ; 
        this.message = entry ; 
      }else{
        varsend = this.myword;
      }
      let fromCache = this.getLocalStorage(varsend.toString());
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
        this.nombre_raff_semantique = this.raffinement.length;

      }else{

      this.Reso.getWords(varsend).subscribe((reponse) => {
        
        if(typeof reponse === 'string'){
          console.log("no things");
          this.error = reponse;
          this.isAvailable = false;
          this.isnotfind = true;
        }else{
          this.definition = reponse.definition;
          const br = /<br\W\/>/g;
          this.definition = this.definition.replace(br,"<br>");
          
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
          this.raffinementMorph = reponse.Raffinement_Morpho ; 
          if(this.definition.length ==0 && this.otherDef.length == 0){
            this.definition = "Aucune";
          }
          this.nombre_raff_semantique = reponse.Raffinement.length;
          this.nombre_raff_morphologique = reponse.Raffinement_Morpho.length;
          
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
  this.fromrelation = false;
}


  ngOnInit() : void  {
    this.show = false;
    this.isAvailable = false; 
    this.isnotfind = false;
    this.definition = "";
    this.node = [];
    this.element = [];
    
  }
  
  imageClick(){
    if(this.ispressed){
      this.showing_relation = 30;
      this.ispressed = false;
    }else{
      this.showing_relation = this.association.length;
      this.ispressed = true;
    }
  }

  initVar() : void {
    this.ispressed = false;
    this.showing_relation = 30 ;
    this.definition ="";
    this.error="";
    this.articles  = "";  
    this.show = false;
    this.relation = null;
    this.isnotfind = false;
    this.element = [];  
    this.association = [];
    this.raffinement = [];
    this.raffinementMorph = [];
    this.nombre_raff_semantique = 0 ; 
    this.nombre_raff_morphologique = 0 ; 
  }

  fullListRelation() : void {
      var obj1 = {"id" : 0 , "type" : "r_associated"} ;
      var obj2= {"id" : 1 , "type" : "r_raff_sem"} ;
      var obj3= {"id" : 2 , "type" : "r_raff_morpho"} ;
      var obj4= {"id" : 3 , "type" : "r_domain"} ;
      var obj5= {"id" : 4 , "type" : "r_pos"} ;
      var obj6= {"id" : 5 , "type" : "r_syn"} ;
      var obj7= {"id" : 6 , "type" : "r_anto"} ;
      var obj8= {"id" : 7 , "type" : "r_hypo"} ;
      var obj9= {"id" : 8 , "type" : "r_has_part"} ;
      var obj10= {"id" : 9 , "type" : "r_holo"} ;
      var obj11= {"id" : 10, "type" : "r_locution"} ;
      var obj12= {"id" : 11, "type" : "r_flpot"} ;
      var obj13= {"id" : 12, "type" : "r_patient"} ;
      var obj14= {"id" : 13, "type" : "r_lieu"} ;
    
   
  }
  

  getLocalStorage(word : string){
    let usercache = JSON.parse(localStorage.getItem(word));
    return usercache;
  }
  

}

