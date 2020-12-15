import { from, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RezoService } from '../../rezo.service';
import {FormControl, NgForm} from '@angular/forms'
import { Observable } from 'rxjs/Observable';
import * as fs from 'fs';
import { resolveTxt } from 'dns';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-basicelements',
  templateUrl: './basicelements.component.html',
  styleUrls: ['./basicelements.component.scss']
})
export class BasicelementsComponent implements OnInit {
  control = new FormControl();
  filteredWords: Observable<string[]>;
  url = "./assets/existingwords.txt";
  public  words : string[] =[];

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.words.filter(word => word.toLowerCase().startsWith(filterValue));
  }
  public ispressed : boolean ; 
  public definition : String ; 
  public search : any = [] ;
  public articles : string;
  public myid : String =null; 
  public node = [] ;
  public relation = [] ;
  isAvailable = false ;
  public isSelected = false ; 
  public isShown = false;
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
  public allRelations: string [];
  public RelationSelectionee ="";
  public results = [];

  searchWord(mot : String){
    this.fromrelation = true ;
    console.log("[RelationSelectionee ------> searchWord : ]"+this.RelationSelectionee) 
    this.onSubmit(mot);

  }
  onSubmit(entry : String) {
    console.log("[entry] is : -----> "+entry)
    console.log("[RelationSelectionee] is : -----> "+this.RelationSelectionee)
    this.initVar();
    this.message = this.myword; 
    let RSelectionee = this.RelationSelectionee;
    console.log("[RSelectionee] is : -----> "+RSelectionee)
    if(this.myword == null)
    {
        console.log("Veuillez saisir un mot");
    }else
    {
          if(RSelectionee != "") // [Selection effectuée]
          { 
              console.log("[------- Selection effectuée ------]")
              this.isAvailable = false;
              this.isShown = true; 
              this.show = false;
              let varsend ;
              if(typeof entry == 'string' && this.fromrelation == true ){
                varsend = entry;
                this.myword = entry ; 
                this.message = entry ; 
              }else
              {
                varsend = this.myword;
              }
              let fromCache = this.getLocalStorage(varsend.toString());
              if(fromCache != null)
              {
                    this.relation = fromCache.relation_sortant;
                    this.results = this.getWordRelations(this.RelationSelectionee);
                    // this.results.sort(function(a, b) {
                    //   return b.poids - a.poids;
                    // });
                    this.results.sort((a, b) => a.name.localeCompare(b.name));
                    console.log(this.results);
                    this.isShown = true;
                    console.log("[serveur] : chui dedans ^^ +++++");
                
              }else
              {
                this.Reso.getWords(varsend).subscribe((reponse) => {
            
                    if(typeof reponse === 'string')
                    {
                      console.log("no things");
                      this.error = reponse;
                      this.isAvailable = false;
                      this.isnotfind = true;
                    }else
                    {
                        this.relation = reponse.relation_sortant;
                        this.results = this.getWordRelations(this.RelationSelectionee);
                        localStorage.setItem(this.myword.toString(), JSON.stringify(reponse));
                    }

                },(error) => 
                  {
                    alert("Impossible de contacter le serveur");
                    this.isAvailable  = false;
                  });
              }
          }else
            {  
//-------------------------------------------------------------------------------------------------------------------//

              console.log("[------- Pas de Selection ------]")
              this.isAvailable = true;
              this.isShown = false; 
              let varsend ;
              if(typeof entry == 'string' && this.fromrelation == true ){
                varsend = entry;
                this.myword = entry ; 
                this.message = entry ; 
              }else
              {
                varsend = this.myword;
              }
              let fromCache = this.getLocalStorage(varsend.toString());
              if(fromCache != null)
              {
                    this.definition = fromCache.definition;
                    this.otherDef = fromCache.otherDef;
                    this.relation = fromCache.relation_sortant;
                    for(let i = 0 ; i < this.relation.length ; i++){
                      if(this.relation[i].type == 0 )
                      {
                        let word = {"name" : "","type":0}; // pour avoir l'id du mot, le poids.
                        word.name = this.relation[i].relation;
                        this.association.push(word);
                      }
                    }
                    this.association.sort((a, b) => a.name.localeCompare(b.name));
                    //console.log("---"+this.association);
                    if(this.otherDef.length > 0 )
                    {
                      this.element = this.otherDef.split("//DEF//");  
                    }
                    this.relation = fromCache.relation_sortant ; 
                    this.isAvailable = false;
                    this.show = true;
                    this.raffinement = fromCache.Raffinement;
                    this.nombre_raff_semantique = this.raffinement.length;
                  //}
              }else
              {
                //console.log("[---------------------- Appel au serveur ----------------]")
                this.Reso.getWords(varsend).subscribe((reponse) => {
            
                if(typeof reponse == 'string')
                {
                  console.log("no things");
                  this.error = reponse;
                  this.isAvailable = false;
                  this.isnotfind = true;
                }else
                {
                    this.definition = reponse.definition;
                    const br = /<br\W\/>/g;
                    this.definition = this.definition.replace(br,"<br>");
                    
                    this.relation = reponse.relation_sortant ; 
                    for(let i = 0 ; i < this.relation.length ; i++){
                      if(this.relation[i].type == 0 )
                      {
                        let word = {"name" : "","type":0};
                        word.name = this.relation[i].relation;
                        this.association.push(word);
                      }
                    }
                    this.association.sort((a, b) => a.name.localeCompare(b.name));
                    this.isAvailable = false;
                    this.show = true;
                    this.raffinement = reponse.Raffinement;
                    this.otherDef = reponse.otherDef;
                    this.raffinementMorph = reponse.Raffinement_Morpho ; 
                    
                    if(this.definition.length ==0 && this.otherDef.length == 0)
                    {
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

              },(error) => 
                {
                  alert("Impossible de contacter le serveur");
                  this.isAvailable  = false;
                }); 
            }
    }
    this.RelationSelectionee = ""; 
    this.fromrelation = false;
  
  }
}



  ngOnInit() : void  {
    this.getFile(this.url);
    this.show = false;
    this.isAvailable = false; 
    this.isnotfind = false;
    this.definition = "";
    this.node = [];
    this.element = [];
    this.filteredWords = this.control.valueChanges.pipe(
      startWith(''),
      map(value => value.length>=3 ? this._filter(value).slice(0,7): this.words.slice(0,0))
    );
    this.http.get('./assets/relations.json').subscribe(
      data => {
        this.allRelations = data as string [];	 // FILL THE ARRAY WITH DATA.
      }
    );
  }

  getWordRelations(RelationSelectionee){
    let wordRelations = [];
        for(let i = 0 ; i < this.relation.length ; i++){
          if ( RelationSelectionee.includes((this.relation[i].type) )){
             let word = {"name" : this.relation[i].relation,"type":this.relation[i].type,"poids":this.relation[i].poids}; 
             word.name = this.relation[i].relation;
             wordRelations.push(word);
                  
          }      
          
    }
        wordRelations.sort();
       return wordRelations; 
  }

  updateRelation(value){
    this.RelationSelectionee = value;
    if(this.RelationSelectionee != "")
      {
        this.isSelected = true;
      }
        if(this.RelationSelectionee == "")
          {
            this.isSelected = false;
          }
    console.log("value of relation selected : "+this.RelationSelectionee);
  
  }
  
  imageClick(params){
    console.log("---"+params);
    
    if(this.ispressed){
      this.showing_relation = 30;
      this.ispressed = false;
    }else{
      if(params.includes('results')){
        this.showing_relation = this.results.length;
        this.ispressed = true;
      }else{
        this.showing_relation = this.association.length;
        this.ispressed = true;
      }
      
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
  };

  getLocalStorage(word : string){
    let usercache = JSON.parse(localStorage.getItem(word));
    return usercache;
  }
public getFile(url: string){
    let txt:string;
    const headers = new HttpHeaders().set('Content-Type', 'Accept-Encoding : undefined');
    this.http.get(url, {headers, responseType: 'text' }).subscribe(data => {
      this.words= data.split("\n");
  }); }
  

}

