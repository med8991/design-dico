import { from } from "rxjs";

export class Word {

  public definition : String ; 
  public node = [] ;
  public message : String ; 
  public relation = [] ;
  public myword : string;
  public raffinement = [] ; 
  public raffinementMorph : [] ; 
  public otherDef : String ;
  public association = [];
  public nombre_raff_semantique : number ; 
  public nombre_raff_morphologique : number ; 
  public element_def = [] ; 
  public element = [];


    constructor(){
        
    }

     initvar(){
    this.association = [];
    this.raffinement = [];
    this.raffinementMorph = [];
    this.nombre_raff_semantique = 0 ; 
    this.nombre_raff_morphologique = 0 ; 
    this.definition ="";
    this.relation = [];
    this.element = [];
    this.node = [];
    }

    affectation(fromCache) {
      const br = /<br\W\/>/g;
      this.definition = fromCache.definition;
      this.definition = this.definition.replace(br,"<br>");
      this.otherDef = fromCache.otherDef;
      this.relation = fromCache.relation_sortant;
      for(let i = 0 ; i < fromCache.relation_sortant.length ; i++){
        if(this.relation[i].type == 0 ){
          let word = {"name" : this.relation[i].relation,"type":this.relation[i].type,"poids":this.relation[i].poids};
          this.association.push(word);
          }
      }
        if(this.otherDef.length > 0 ){
        this.element = this.otherDef.split("//DEF//");  
        }
        
      this.raffinement = fromCache.Raffinement;
      this.nombre_raff_semantique = this.raffinement.length;
      
      if(this.definition.length ==0 && this.otherDef.length == 0){
        this.definition = "Aucune";
      }     
    }
}