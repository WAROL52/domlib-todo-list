
// eslint-disable-next-line no-unused-vars

class Domlib { 
  constructor({el,Constructor}) {
    if(!Traper.isConstructor(Constructor)){
      const msg="Constructor must be a constructor"
      console.warn(msg);
      throw msg
    }
    if (Object.getPrototypeOf(Constructor) !== Domlib.Element) {
      console.warn(''+`the class ${Constructor.name} must extends Domlib.Element`);
      throw ''+`the class ${func.name} must extends Domlib.Element`;
    }
    const instanceConstructor=new Domlib.TrapLib(new Constructor)
    const core=new Domlib.#Core
    core.attachElement(el,instanceConstructor)
    /**@type {DomlibElement}*/
    return instanceConstructor
  }
  static #Core = class Core{
    constructor() {
      Domlib.#Core.#core ??= this;
      return Domlib.#Core.#core;
    }
    static TrapLib = class {
      constructor(target = {}, handler={},listExc = []) {
        if (!target) return target;
        if (Core.isDom(target)) return target;
        const pushTraplib=(trap)=>{
          for (let at in trap) {
            if (typeof trap[at] == "object") {
              const index = listExc.indexOf(at);
              if (index == -1 ) {
                trap[at] = new this.constructor(trap[at]);
              }
            }
          }
        }
        
        if(target['$isTrapLib']) {
          pushTraplib(target)
          return target
        }
        
        if(typeof handler=='object'){
          Object.assign(this,handler)
        }

        this.onSet=(option,t,h)=>{
          handler?.onSet?.(option,t,h)
          if (typeof option.newValue == "object") {
            option.newValue = new this.constructor(option.newValue);
          }
        }

        const trap = target.$isTrap?target:  new Traper(target, this);

        Object.defineProperty(target,'$isTrapLib',{
          value:true,
          writable:false,
          configurable:false,
          enumerable:false
        })
        pushTraplib(trap)
        return trap;
      }
    };
    ElConsole=class ElConsole {
      constructor(el, logName = "Pretty-Console", logTitle = "log-title") {
        this.el = Domlib.createElement(el.outerHTML);
        this.logName = logName;
        this.logTitle = logTitle;
      }
      
      colorAttrMessage = "gray";
      colorAttrExpression = "#BACCD8";
      colorAttrTarget = "red";
      colorLogMessage = "pink";
      colorEl = "#47A4E2";
      colorAttrName = "#98C7E6";
      colorAttrValue = "";
      colorInnerHTML = "gray";
      
      handler=null
      attr=null
      target=null
      lastState=null
      nameState=null

      attrName = "";
      attrNameOrValue = "name";
      attrExpression = "attrExpression ";
      attrMessage = "attrMessage";
      logMessage = "logMessage";
      message = {
        french: "Bonjour le Monde",
        english: "Hello World",
      };
      static restrictionExpression={
        isNoUndefined:(handler,target,attr)=>{
          if(target==undefined) return{
            logMessage:'Reference Error',
            attrExpression:`${handler.constructor.name}.${attr.value}=`,
            attrMessage:'undefined',
            message:{
              french:`'${handler.constructor.name}.${attr.value}': ne doit pas être null`,
              english:`'${handler.constructor.name}.${attr.value}':must not be null`,
              malagasy:`ana tô ma rah nagnino , tsy mahay rah DEHORS!! `
            },
            msgThrow:`In ${handler.localName}[${attr.name}='${attr.value}'] : '${attr.value}' is not defined `
          }
          return true
        },
        isTypeArray:(handler,target,attr)=>{
          if(!Array.isArray(target)) return{
            logMessage:'Reference Error',
            attrExpression:`Array.isArray(${handler.constructor.name}.${attr.value})->`,
            attrMessage:Array.isArray(target),
            message:{
              french:`'${handler.constructor.name}.${attr.value}': doit  être de type tableau`,
              english:`'${handler.constructor.name}.${attr.value}':must be  type array `
            },
            msgThrow:`In ${handler.localName}[${attr.name}='${attr.value}'] : '${attr.value}'is not type Array`
          }
          return true
        },
        isTypeObject:(handler,target,attr)=>{
          if(typeof target!='object') return{
            logMessage:'Type Error',
            attrExpression:`typeof ${handler.constructor.name}.${attr.value}->`,
            attrMessage:typeof target,
            message:{
              french:`'${handler.constructor.name}.${attr.value}': doit être type objet`,
              english:`'${handler.constructor.name}.${attr.value}':must be object type`
            },
            msgThrow:`'${handler.constructor.name}.${attr.value}' is not object type`
          }
          return true
        },
        isTypeFunction:(handler,target,attr)=>{
          if(typeof target!='function') return{
            logMessage:'Type Error',
            attrExpression:`typeof ${handler.constructor.name}.${attr.value}->`,
            attrMessage:typeof target,
            message:{
              french:`'${handler.constructor.name}.${attr.value}': doit être type fonction`,
              english:`'${handler.constructor.name}.${attr.value}':must be function type`
            },
            msgThrow:`'${handler.constructor.name}.${attr.value}' is not function type`
          }
          return true
        },
      }
      getLogByRule(rule){
        const restriction=ElConsole.restrictionExpression[rule]
        if(!restriction){
          console.warn(`rule '${rule}' is no valid`)
          console.log('list rule valid are:',Object.keys(ElConsole.restrictionExpression))
          throw `rule '${rule}' is no valid`
        }
        
        const result=restriction?.(this.handler,this.lastState?.[this.nameState],this.attr)
            if(result!==true){
              return [[
                ...this.getLogFull({
                  attrNameOrValue:'value',
                  ...result
                })
                ],result?.msgThrow]
            }
            return false
      }
      get styleInnerHTML() {
        return [`color:${this.colorInnerHTML}`];
      }
      get styleEl() {
        return [`color:${this.colorEl}`];
      }
      get styleAttr() {
        return [
          `color:${this.colorAttrName}`,
          `color:${this.colorEl}`,
          `color:${this.colorAttrValue}`,
          `color:${this.colorEl}`,
        ];
      }
    
      logMessage = "";
      get startEl() {
        return `%c<${this.el.localName}`;
      }
      get endEl() {
        return `%c>%c...%c</${this.el.localName}>`;
      }
      get attributes() {
        const list = [];
        for (let attr of this.el.attributes) {
          list.push(`%c${attr.name}%c="%c${attr.value}%c"`);
        }
        return list;
      }
      _listStyleAttr(len) {
        const list = [];
        for (let index = 0; index < len; index++) {
          list.push(...this.styleAttr);
        }
        return list;
      }
      get outerHTML() {
        const outerHTML = [this.startEl];
        outerHTML.push(...this.attributes);
        outerHTML.push(this.endEl);
        return outerHTML.join(" ");
      }
      get listStyleEl() {
        
        return [
          ...this.styleEl,
          ...this._listStyleAttr(this.el.attributes.length),
          ...this.styleEl,
          ...this.styleInnerHTML,
          ...this.styleEl,
        ];
      }
    
      _stringLogAtt(
        attrName,
        attrNameOrValue = "name",
        attrExpression = "expression ",
        attrMessage = "message"
      ) {
        if (this.el.getAttribute(attrName)==undefined) {
          const msg = `this element don't have attribute named '${attrName}'`;
          console.warn(msg);
          console.log(this.el.attributes);
          throw msg;
        }
        const bonus = attrNameOrValue == "name" ? 0 : attrName.length + 2;
        const strAttr = this.outerHTML.slice(
          0,
          this.outerHTML.indexOf(
            `${attrName}%c="%c${this.el.getAttribute(attrName)}%c"`
          )
        );
        const len_ = strAttr.split("%c").length - 1;
        const spaceLamba=attrNameOrValue == "name"
        ? 0
        : this.el.getAttribute(attrName).length ?0:-1
        const len = strAttr.length - len_ * 2 + bonus+spaceLamba;
        return `\n${" ".repeat(len)}%c${"^".repeat(
          attrNameOrValue == "name"
            ? attrName.length
            : this.el.getAttribute(attrName).length||2
        )}%c(%c${attrExpression}%c${attrMessage}%c)\n`;
      }
    
      get styleLogAttr() {
        return [
          `color:${this.colorAttrTarget}`,
          `color:${this.colorInnerHTML}`,
          `color:${this.colorAttrExpression}`,
          `color:${this.colorAttrMessage}`,
          `color:${this.colorInnerHTML}`,
        ];
      }
      getLogEl = function () {
        return [this.outerHTML, ...this.listStyleEl];
      }.bind(this);
      logEl = function () {
        console.log(...this.getLogEl());
      }.bind(this);
      getLogAttr = function (
        attrName,
        attrNameOrValue = "name",
        attrExpression = "expression ",
        attrMessage = "message"
      ) {
        const logAt = this._stringLogAtt(
          attrName,
          attrNameOrValue,
          attrExpression,
          attrMessage
        );
        return [this.outerHTML + logAt, ...this.listStyleEl, ...this.styleLogAttr];
      }.bind(this);
      logAttr = function (
        attrName,
        attrNameOrValue = "name",
        attrExpression = "expression ",
        attrMessage = "message"
      ) {
        console.log(
          ...this.getLogAttr(attrName, attrNameOrValue, attrExpression, attrMessage)
        );
      }.bind(this);
      getLogFull = function ({
        attrName = this.attrName,
        attrNameOrValue = this.attrNameOrValue,
        attrExpression = this.attrExpression,
        attrMessage = this.attrMessage,
        logName = this.logName,
        logTitle = this.logTitle,
        logMessage = this.logMessage,
        message = this.message,
      }) {
        const head = `\n%c(%c${logName}%c)%c[%c${logTitle}%c] %c${logMessage}\n\n`;
        const styleHead = [
          ...this.styleInnerHTML,
          `color:${this.colorEl};border-bottom:1px dotted white`,
          ...this.styleInnerHTML,
          `color:${this.colorAttrExpression}`,
          `color:${this.colorAttrMessage}`,
          `color:${this.colorAttrExpression}`,
          `color:${this.colorLogMessage}`,
        ];
        var stringMessage = "\n";
        const styleMsg = [
          ...this.styleInnerHTML,
          `color:${this.colorAttrExpression}`,
        ];
        var styleMessage = [];
        for (let [nameMessage, valueMessage] of Object.entries(message)) {
          stringMessage += `%c${nameMessage}:%c${valueMessage}\n`;
          styleMessage.push(...styleMsg);
        }
        const body =
          head +
          this.outerHTML +
          this._stringLogAtt(
            attrName,
            attrNameOrValue,
            attrExpression,
            attrMessage
          ) +
          stringMessage;
        return [
          body,
          ...styleHead,
          ...this.listStyleEl,
          ...this.styleLogAttr,
          ...styleMessage,
        ];
      }.bind(this);
      logFull = function ({
        attrName = this.attrName,
        attrNameOrValue = this.attrNameOrValue,
        attrExpression = this.attrExpression,
        attrMessage = this.attrMessage,
        logName = this.logName,
        logTitle = this.logTitle,
        logMessage = this.logMessage,
        message = this.message,
      }) {
        console.log(
          ...this.getLogFull({
            attrName,
            attrNameOrValue,
            attrExpression,
            attrMessage,
            logName,
            logTitle,
            logMessage,
            message,
          })
        );
      }.bind(this);
    }
    HTMLText=class HTMLText{
      static #regexIsDataR =/\{\{\s*(\[?\s*[a-zA-Z_]*\w*(\.[a-zA-Z_]*\w*\s*)*\s*\]?)\s*\}\}/gm
      static attachData(htmlText,handler,dico={dynamic:{},stat:{}},option,restEl={}){
        if (!Core.isDomText(htmlText)) return;
        const result = htmlText.data.match(this.#regexIsDataR);
        // const el = htmlText.parentElement;
        // if (!el) return console.warn("bug");
        const listEvent=[]
        if (result) {
          this.#splitTextChild(result, htmlText,restEl,dico).forEach((childSplited) =>{
            listEvent.push(this.#attachTextChild(childSplited, handler,dico.dynamic,dico.stat,option))
          });
        }
        return listEvent
      }
      static #splitTextChild(listMatch, child,restEl) {
        if (!Core.isDomText(child)) return [];
        const listChilds = [];
        restEl.elVar=[]
        restEl.elConst=[]
        listMatch.forEach((item,i) => {
          const indexToSplit = child.data.indexOf(item);
          var childSplited;
          if (indexToSplit != -1 && indexToSplit < child.data.length) {
            childSplited = child.splitText(indexToSplit);
            restEl.elConst.push(child)
            child = childSplited.splitText(item.length);
            
            if(i==listMatch.length-1){
              restEl.elConst.push(child)
            }
            childSplited.data = childSplited.data.replace(
              this.#regexIsDataR,
              (_corresp, path) => {
                restEl.elVar.push({
                  txt:childSplited,
                  path
                })
                return path;
              }
            );
            listChilds.push(childSplited);
          }
        });
        return listChilds;
      }
      static #attachTextChild(textChild, handlerNode ,dicoD={},dicoS={},option={}) {
        if (!Core.isDomText(textChild)) return;
        textChild.data=textChild.data.replace(/\s*/g,'')
        const operator=[]
        if(textChild.data.slice(0,3)=="..."){
          textChild.data=textChild.data.slice(3)
          operator.push('...')
        }


        const getPathD=()=>{
          const list=textChild.data.split('.')
          if(list.length==1) return dicoD[textChild.data]??textChild.data
          const path= dicoD?.[list[0]]
          if(!path) return textChild.data
          return path+textChild.data.slice(list[0].length)
        }
        const attachment=textChild.data in dicoS
          ?{
            lastState:new Traper(dicoS), 
            name:textChild.data
          }
          :handlerNode.$getStateByPath(getPathD())
          const {lastState, name}=attachment
        const data=lastState
        if (!data || !data.$isTrap) {
          textChild.data = ''+`{${textChild.data} undefined\}`;
          return;
        }
        const value = data[name];
        const dico={
          dynamic:dicoD,
          static:dicoS
        }
        attachment.operator=operator
        return this.#attachRoot({text:textChild,dico,attachment,template:undefined,option});
      }
      static #attachRoot({text,dico,attachment,template,option}) {
        if (Core.isDom(attachment.value)){
          return new this.RenderTextElement({text,dico,attachment,template,option})
        }
        if(typeof attachment.value=='object')
        return new this.RenderTextObject({text,dico,attachment,template,option});
        return new this.RenderTextDefault({text,dico,attachment,template,option})
      }
      
      static RenderText=class RenderText{
        constructor({text,dico,attachment,template,option}){
          this.option=option
          this.text=text
          this.dico=dico;
          this.attachment=attachment;
          this.template=template;
          this.lastState=attachment.lastState
          this.firstState=attachment.firstState
          this.name=attachment.name
          this.path=attachment.path
          this.type=this.constructor.name
          this.id=this.type+"-"+parseInt(Math.random()*10*10**10)
          this.eventListener=null
          this.init()
        }
        init(){
          this.eventListener=this.lastState.$on.change(this.name,this.onChange.bind(this),this.removeEvent.bind(this))
          this.eventListener.attachData=this.constructor.name
          this.eventListener.target=this.value
          if(this.option){
            this.option.listEventListener?.push?.(this.eventListener)
            this.option.listFuncRemoveEvent?.push?.(this.removeEvent)
          }
        }
        get value(){
          return this.lastState[this.name]
        }
        setValueInText(value=this.value){
          if(Core.isDom(value)){
            this.removeEvent()
            new HTMLText.RenderTextElement({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }else if(typeof value=='object'){
            this.removeEvent()
            new HTMLText.RenderTextObject({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }else{
            if(this.attachment.isString){
              this.text.data=` "${value}"`
            }else{
              this.text.data=value
            }
          }
        }
        onChange(ev){
          this.setValueInText(this.value)
        }
        #isRemmoved=false
        get isRemoved(){return this.#isRemmoved}
        onRemoveEv=()=>{}
        removeEvent=()=>{
          if(this.isRemoved) return 
          this.#isRemmoved=true
          this.onRemoveEv()
          this.text.data=""
          this.eventListener._remove()
        }
      }
      static RenderTextDefault=class RenderTextDefault extends this.RenderText{
        constructor({ text,dico,attachment,template,option}){
          super({ text,dico,attachment,template,option})
          this.setValueInText(this.value)
        }
      }
      static RenderTextElement=class RenderTextElement extends this.RenderText{
        constructor({ text,dico,attachment,template,option}){
          super({ text,dico,attachment,template,option})
          this.lastEl=this.value
          this.setValueInText(this.value)
        }
        onRemoveEv=()=>{
          this.lastEl?.remove?.()
        }
        setValueInText(value=this.value){
          if(Core.isDom(value)){
            if(value!=this.lastEl){
              this.lastEl?.remove?.()
              this.lastEl=value
            }
            this.text.after(value)
            this.text.data=""
          }else if(typeof value=='object'){
            this.removeEvent()
            new HTMLText.RenderTextObject({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }else{
            this.removeEvent()
            new HTMLText.RenderTextDefault({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }
        }
      }
      static RenderTextObject=class RenderTextObject extends this.RenderText{
        constructor({ text,dico,attachment,template,option}){
          super({ text,dico,attachment,template,option})
          this.elements=[]
          if(this.template){
            this.textFoot=new Text()
          }else if(attachment?.operator?.includes?.('...')){
            this.text.data=''
            this.textFoot=new Text("")
          }else{
            this.text.data=Array.isArray(this.value)?'[':'{'
            this.textFoot=new Text(Array.isArray(this.value)?']':'}')
          }
          this.text.after(this.textFoot)
          this.rend()
          this.onChangeEachValue=this.value.$on.change('*',(ev)=>{
            if(ev.$option.oldValue==undefined){
              const txt=this.textComa(ev.$option.key)
              const _txt=this.template
              ?Domlib.createElement(this.template)
              :new Text();
              const push=()=>this.elements.push({txt,render:this.send(_txt,ev.$option.key,this.value[ev.$option.key])})
              if(Array.isArray(this.value)){
                if(!isNaN(ev.$option.key)){
                  const index=Number(ev.$option.key)
                  this.rendArray(index,txt,_txt)
                  return push()
                }
              }
                this.textFoot.before(txt,_txt)
                push()
            }
          })
          this.onDeleteEachValue=this.value.$on.delete('*',(ev)=>{
            if(ev.$option.break) return
            const index=this.elements.findIndex(ob=>{
              const isFinded=ob.render.name==ev.$option.key
              if(isFinded){
                ob.render.removeEvent?.()
                ob.txt.data=""
                return true
              }
            })
            if(index!=-1){
              this.elements.splice(index,1)
            }
          })
        }
        rendArray(index,txt,_txt){
          //el.before(txt,_txt)
          var indexSelected
          var value
          var reg=this.elements.forEach(e=>{
            if(!isNaN(e.render.name)){
              const i=Number(e.render.name)
              const val=Math.abs(index-i)
              value??=val
              if(val<=value && e.render){
                value=val
                indexSelected=i
              }
            }
          })
          if(!reg)reg=this.elements.find(e=>e.render.name==indexSelected);
          if(!reg) return this.textFoot.before(txt,_txt);
          if(indexSelected>index){
            reg.txt.before(txt,_txt)
          }else{
            if(reg.render.textFoot){
              reg.render.textFoot.after(txt,_txt)
            }else{
              reg.render.text.after(txt,_txt)
            }
          }
        }
        send(text,index,value){
          if(this.template){
            const core=new Core;
            const dico={
              dynamic:{},
              stat:new Traper()
            }
            if(this.dico.dynamic['value']){
              dico.dynamic[this.dico.dynamic['value']]=this.attachment.path+"."+index
            }
            if(this.dico.stat['index']){
              dico.stat[this.dico.stat['index']]=index
            }
            const directive=core.attachElement(text,this.firstState,dico)

            const ob={
              directiveEv:directive.listFuncRemoveEvent??[],
              text,name:index
            }
            ob.removeEvent=()=>{
              ob.directiveEv.forEach(fn=>fn())
              if(Core.isDomText(ob.text)){
                ob.text.data=""
              }else{
                ob.text.remove()
              }
            }
            return ob
          }else{
            const attachment=this.firstState.$getStateByPath(this.attachment.path+"."+index)
            if(Core.isDom(value)){
              return new HTMLText.RenderTextElement({text,dico:this.dico,attachment,template:this.template})
            }else if(typeof value=='object'){
              return new HTMLText.RenderTextObject({text,dico:this.dico,attachment,template:this.template})
            }else{
              if(typeof attachment.value=='string'){
                attachment.isString=true
              }
              return new HTMLText.RenderTextDefault({text,dico:this.dico,attachment,template:this.template})
            }
          }
        }
        textComa(index){
          if(this.template) return new Text()
          if(this.attachment?.operator?.includes?.('...')) return new Text() 
          return new Text(Array.isArray(this.value)
          ?this.elements.length==0?'':' ,'
          :this.elements.length==0?`"${index}":`:` ,"${index}":`)
        }
        rend(){
          if(this.template){
            for(let index in this.value){
              const txt=this.textComa(index)
              const _txt=Domlib.createElement(this.template)
              this.textFoot.before(txt,_txt)
              this.elements.push({txt,render:this.send(_txt,index,this.value[index])})
            }
          }else{
            for(let index in this.value){
              const txt=this.textComa(index)
              const _txt=new Text()
              this.textFoot.before(txt,_txt)
              this.elements.push({txt,render:this.send(_txt,index,this.value[index])})
            }
          }
        }
        onRemoveEv=()=>{
          if(this.template){
            this.elements.forEach(ob=>{
              ob.txt.data=""
              ob.render.text.remove()
              ob.render.directiveEv.forEach(fn=>fn?.())
            })
          }else{
            this.elements.forEach(ob=>{
              ob.txt.data=""
              ob.render.removeEvent()
            })
          }
          this.textFoot.data=""
          this.onChangeEachValue._remove()
          this.onDeleteEachValue._remove()
        }
        setValueInText(ev){
          this.removeEvent()
          if(Core.isDom(this.value)){
            new HTMLText.RenderTextElement({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }else if(typeof this.value=='object'){
            new HTMLText.RenderTextObject({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }else{
            new HTMLText.RenderTextDefault({text:this.text,dico:this.dico,attachment:this.attachment,template:this.template})
          }
        }
      }
    }
    HTMLComponent = class HTMLComponent {
      constructor(builder, builderType) {
        this.builderType = builderType;
        this.builder = builder;
      }
      name;
      instances={}
      events={
        onMounted:[]
      }
      initChildrens(el, handler,children) {
        if(!handler._children['noSlot']){
            handler._children['noSlot']=[]
            Object.defineProperty(handler._children,'noSlot',{
              writable:false,
              enumerable:false
            })
        }
        if(!handler._children['noSlotText']){
          handler._children['noSlotText']=[]
          Object.defineProperty(handler._children,'noSlotText',{
            writable:false,
            enumerable:false
          })
        }
        if(!handler._children['noSlotElement']){
          handler._children['noSlotElement']=[]
          Object.defineProperty(handler._children,'noSlotElement',{
            writable:false,
            enumerable:false
          })
        }
        const pushInNoSlot=(e)=>{
          handler._children['noSlot'].push(e)
          if(Core.isDomText()){
            handler._children['noSlotText'].push(e)
          }else{
          handler._children['noSlotElement'].push(e)
          }
        }
        const initSlot=(child)=>{
          child.forEach(e=>{
            if(Core.isDomElement(e)){
              const slot=e.getAttribute('slot')
              if(slot){
                if(handler._children[slot]&& Array.isArray(handler._children[slot])){
                  handler._children[slot].push(e)
                }else{
                  handler._children[slot]=[e]
                  Object.defineProperty(handler._children,slot,{
                    writable:false,
                    enumerable:false
                  })
                }
              }else{
                pushInNoSlot(e)
              }
            }else{
              pushInNoSlot(e)
            }
          })
        }
        if(el.childNodes.length){
          handler._children.push(...el.childNodes);
          initSlot(el.childNodes)
        }
        if(children.length){
          handler._children.push(...children)
          initSlot(children)
        }
      }
      initProps(el, handler,props) {
        for (let attr of el.attributes) {
          handler._props[attr.name] = attr.value;
        }
        if(typeof props!='object') return
        for(let at in props){
          handler._props[at]=props[at]
        }
      }
      initParentAndChilds(fastHandler,handler){
        if(fastHandler){
          if(!fastHandler.handlerChild) fastHandler.handlerChild=[]
          fastHandler.handlerChild.push(handler)
          handler.handlerParents={
            ...handler.handlerChild,
            [fastHandler?.localName??'']:fastHandler
          }
          var i=0
          while (handler.handlerParents[i]) {
            if(!handler.handlerParents[i+1]){
              handler.handlerParents[i+1]=fastHandler
              break
            }
            i++
          }
          if(!handler.handlerParents[0] ) handler.handlerParents[0]=fastHandler
        }else{
          handler.handlerParents=null
        }
      }
      initDirecctive(localName,directives){
        (new Core).HTMLDirective.createDirectiveComponent(localName,directives)
      }
    };
    HTMLDirective = class HTMLDirective {
      onInit(){}
      data={}

      restriction=[]
      static listDirectiveNoRendChild=['for','switch']
      static create(directiveName,onInit,option,toSave=true){
        this.isDirectiveValid({
          directiveName:"directive-"+directiveName,onInit,reg:directiveName
        })
        const model={
          directiveName:"directive-"+directiveName,
          restriction:[...option?.restriction??[]],
          reg:directiveName,
          regex:this.createRegexValid(directiveName),
          data:option?.data??{},
          directive:{
            directiveName:"directive-"+directiveName,
            onInit,
          }
        }
        if(toSave)this.#directiveCustom.push(model);
        return model
      }
      static createRegexValid(regx){
        // eslint-disable-next-line no-useless-escape
        return new RegExp('^'+regx.toString()+''+`:(\.?([A-z]+[-_]*)+(\.[A-z]+[-_]*)*)?`)
      }
      static directiveComponent={}
      static removeDirectiveComponent=(idEl)=>{
        delete this.directiveComponent[idEl]
      }
      static getDirectiveComponent=(idEl)=>{
        return this.directiveComponent[idEl]
      }
      static createDirectiveComponent(ComponentName,directives){
        if(!this.directiveComponent[ComponentName])this.directiveComponent[ComponentName]=[]
        if(!directives) return
        for(let [name,value] of Object.entries(directives)){
          const result=this.create(name,typeof value=='function'?value:value?.onInit,value,false)
          this.directiveComponent[ComponentName].push(result)
        }
      }
      static #directiveNative=[
        { //directive-model []

          directiveName:'',
          restriction:['isNoUndefined','isTypeArray','isTypeObject','isTypeFunction'],
          reg:'bind',
          regex:this.createRegexValid('.x.x.'),
          data:{},
          directive:{
            directiveName:'',
            onInit:(el,attr,option)=>{console.log(el,attr,option);},
          }
        },
        { // 1-directive-attr [x]
          directiveName:"directive-attr",
          restriction:['isNoUndefined'],
          regex:this.createRegexValid('(bind)?'),
          data:{},
          reg:'bind',
          directive:{
            directiveName:"directive-attr",
            onInit:(el,attr,option)=>{
              const {lastState,name}=option.attachment
              const rendEl=()=>{
                if(option.opt in el){
                  el[option.opt]=lastState[name]
                }else{
                  el.setAttribute(option.opt,lastState[name])
                }
              }
              const listEvent=[]
              option.opts.slice(1).forEach(eventName=>{
                const onEvent=()=>lastState[name]=el[option.opt]??el.getAttribute(option.opt)
                el.addEventListener(eventName,onEvent)
                listEvent.push(()=>el.removeEventListener(eventName,onEvent))
              })
              option.onValueChange=rendEl;
              option.onEventRemove=()=>listEvent.forEach(fn=>fn?.())
              rendEl()
            },         
          }                    
        },                                                                                      
        { // 4-directive-ref [x]
          directiveName:'directive-ref',
          restriction:[],
          reg:'ref',
          regex:this.createRegexValid('ref'),
          data:{},
          directive:{
            directiveName:'directive-ref',
            onInit:(el,attr,option)=>{
              if(!option.handler._ref)option.handler._ref={}
              option.handler._ref[attr.value]=el
            },
          }
        },
        { // 2-directive-event [x]
          directiveName:'directive-event',
          restriction:['isNoUndefined','isTypeFunction'],
          reg:'on',
          regex:new RegExp(''+`^(on:)|@(\.?([A-z]+[-_]*)+(\.[A-z]+[-_]*)*)?`),
          data:{},
          directive:{
            directiveName:'directive-event',
            onInit:(el,attr,option)=>{
              if(option.opt[0]=='@')option.opt=option.opt.slice(1)
              const {lastState,name,firstState}=option.attachment
              if(!Core.isDomElement(el)){
                return console.warn('Erreur grave [Interne] , ceci n\'est pas un element HTML',el);
              }
              const getOption=()=>{
                if(option.opts.includes('true')) return true
                if(option.opts.includes('false')) return false
                return {
                  capture:option.opts.includes('capture'),
                  once:option.opts.includes('once'),
                  passive:option.opts.includes('passive'),
                  useCapture:option.opts.includes('useCapture'),
                }
              }
              const opt=option.opt;
              const removeEvent=()=>{
                el.removeEventListener(opt,rendEv,getOption())
                  return true
              }
              const createEvent=()=>{
                el.addEventListener(opt,rendEv,getOption())
                return true
              }
              const rendEv=(e)=>{
                e.removeEvent=removeEvent
                e.recreateEvent=createEvent
                if(option.opts.includes('prevent'))e.preventDefault()
                return (lastState[name]).call(el,e,firstState)
              }
              createEvent()
              option.onValueChange=(option)=>{
                removeEvent()
                if(typeof option.value=='function')createEvent()
              }
              option.onEventRemove=removeEvent
            },
          }
        },
        { // 3-directive-emit [x]
          directiveName:'directive-emit',
          reg:'emit',
          regex:this.createRegexValid('emit'),
          data:{},
          directive:{
            directiveName:'directive-emit',
            onInit:(el,attr,option)=>{
              if(!Core.isDomElement(el)){
                return console.warn('Erreur grave [Interne] , ceci n\'est pas un element HTML',el);
              }
              const getOption=()=>{
                if(option.opts.includes('true')) return true
                if(option.opts.includes('false')) return false
                return {
                  capture:option.opts.includes('capture'),
                  once:option.opts.includes('once'),
                  passive:option.opts.includes('passive'),
                  useCapture:option.opts.includes('useCapture'),
                }
              }
              const opt=option.opt;
              const removeEvent=()=>{
                el.removeEventListener(opt,rendEv,getOption())
                  return true
              }
              const createEvent=()=>{
                el.addEventListener(opt,rendEv,getOption())
                return true
              }
              const rendEv=(e)=>{
                e.removeEvent=removeEvent
                e.recreateEvent=createEvent
                if(option.opts.includes('prevent'))e.preventDefault()
                option.handler.$emitEvent(attr.value,e)
                return option.handler.el.dispatchEvent(new CustomEvent(attr.value, {
                  detail:e,
                  bubbles:option.opts.includes('bubbles'),
                  cancelable:option.opts.includes('cancelable'),
                  composed:option.opts.includes('composed'),
                }))
              }
              createEvent()
            },
          }
        },
        { // 5-directive-if [x]
          directiveName:'directive-if',
          restriction:['isNoUndefined'],
          reg:'if',
          regex:this.createRegexValid('if'),
          data:{},
          directive:{
            directiveName:'directive-if',
            onInit:(el,attr,option)=>{
              const {lastState,name}=option.attachment
              if(!(['true','false',undefined].includes(option.opt))){
                console.warn(`In ${el.localName}[${attr.name}='${attr.value}'] : '${option.opt}' is not valid listValid=>[.true,.false,'']`);
                throw `In ${el.localName}[${attr.name}='${attr.value}'] : '${option.opt}' is not valid listValid=>[.true,.false,''] `
              }
              const comment=new Text()
              el.after(comment)
              const init=()=>{
                if(!!lastState[name]){
                  comment.after(el)
                }else{
                  el.remove()
                }
              }
              init()
              option.onValueChange=init
            },
          }
        },
        { // 6-directive-form []  
          directiveName:'directive-form',
          restriction:['isNoUndefined'],
          reg:'form',
          regex:this.createRegexValid('form'),
          data:{},
          directive:{
            directiveName:'directive-form',
            onInit:(el,attr,option)=>{
              const {lastState,name}=option.attachment
              const type={
                checkbox:()=>{
                  const rendArray=()=>{
                    if(lastState[name].includes(el.value)){
                      el.checked=true;
                    }
                  }
                  const onEvent=()=>{
                    if(Array.isArray(lastState[name])){
                      if(el.checked){
                        lastState[name].push(el.value)
                      }else{
                        const index=lastState[name].indexOf(el.value)
                        if(index!=-1){
                          lastState[name].splice(index,1)
                        }
                      }
                      rendArray()
                    }else{
                      if(el.checked){
                        lastState[name]=el.getAttribute('true-value')??true
                      }else{
                        lastState[name]=el.getAttribute('false-value')??false
                      }
                    }
                  }
                  const onChange=()=>{
                    if(Array.isArray(lastState[name])){
                      rendArray()
                    }else{
                      if(lastState[name]===true||el.getAttribute('true-value')==lastState[name]){
                        el.checked=true
                      }else{
                        el.checked=false
                      }
                    }
                  }
                  onChange()
                  el.addEventListener('change',onEvent)
                  option.onValueChange=onChange
                  option.onEventRemove=()=>{
                    el.removeEventListener('change',onEvent)
                    return true
                  }
                }
              }
              if(el.localName=='input'){
                if(el.type=='checkbox') return type.checkbox()
              }
            },
          }
        },
        { // 7-directive-style [x]
          directiveName:'directive-style',
          restriction:['isNoUndefined','isTypeObject'],
          reg:'style',
          regex:this.createRegexValid('style'),
          data:{},
          directive:{
            directiveName:'directive-style',
            onInit:(el,attr,option)=>{
              const {lastState,name}=option.attachment
              var handler=lastState[name]
              const editStyle=(name,value)=>{
                el.style[name]=value
              }
              const rendStyle=()=>{
                Object.assign(el.style,lastState[name])
                // const trapEv=lastState[name].$on.change('*',onChange)
                // lastState[name].$on.delete('*',onDelete) 
              }
              rendStyle()
              option.onValueChange=(ev)=>{
                const logs=option.pc.getLogByRule('isTypeObject')
                    if(logs){
                      console.warn(...logs[0]);
                      throw logs[1]
                    }
                iniEv(ev.$option.value)
              }
              option.onEventRemove=()=>{
                removeEv()
                isRemoved=true
                return true
              }
            },
          }
        },
        { // 8-directive-switch [x]
          directiveName:'switch',
          restriction:['isNoUndefined'],
          reg:'switch',
          regex:this.createRegexValid('switch'),
          data:{},
          directive:{
            directiveName:'',
            onInit:(el,attr,option)=>{
              const {lastState,name}=option.attachment
              var elDefault
              const createComment=(_el)=>{
                const comment=document.createComment(`${_el.localName} case='${_el.getAttribute('case')}'`)
                _el.after(comment)
                return comment
              }
              const listEl=()=>[...el.querySelectorAll('[case]')]
              var listComment=[]
              const initComment=()=>{
                listComment=listEl().map(_el=>{
                  const finded=listComment.find(o=>o.el==_el)
                  return finded??{
                    comment:createComment(_el),
                    el:_el
                  }
                })
                return listComment
              }
              initComment()
              const rendEl=()=>{
                var hasfind=false
                listComment.forEach(o=>{
                  const cas=o.el.getAttribute('case')
                  if(cas=='default'){
                    elDefault=o
                  }
                  if(lastState[name]==cas){
                    o.comment.after(o.el)
                    o.comment.remove()
                    hasfind=true
                  }else{
                    o.el.after(o.comment)
                    o.el.remove()
                  }
                })
                if(!hasfind){
                  if(elDefault){
                    elDefault.comment.after(elDefault.el)
                    elDefault.comment.remove()
                  }
                }
              }
              rendEl()
              option.onValueChange=rendEl
            },
          }
        },
        { // 9-directive-for []
          directiveName:'directive-for',
          restriction:['isNoUndefined','isTypeObject'],
          reg:'for',
          regex:this.createRegexValid('for'),
          data:{},
          directive:{
            directiveName:'directive-for',
            onInit:(el,attr,option)=>{
              const {lastState,name}=option.attachment
              const comment=new Text()
              var toRemoving
              el.setAttribute('directiveController',"for")
              el.removeAttributeNode(attr)
              el.after(comment)

              var {outerHTML:template}=el
              const _el=Domlib.createElement(template)
              const opts=attr.name.slice(attr.name.indexOf(':')+1).split('.').filter(e=>e)
              const rendLoup=(el,data,path,attr)=>{
                const _el=Domlib.createElement('')
                comment.after(_el)
                const core=new Core
                const dico={
                  dynamic:{
                    ['value']:opts[0]
                  },
                  stat:{
                    ['index']:opts[1]
                  },
                  path
                }

                const ob=new core.HTMLText.RenderTextObject({
                  text:_el,
                  template,
                  attachment:option.attachment,
                  dico
                })
                el.remove()
              }
              rendLoup(el,lastState[name],option.attachment.path,attr)
            },
          }
        },
        { // 10-directive-call [x]
          directiveName:'directive-call',
          restriction:['isNoUndefined','isTypeFunction'],
          reg:'call',
          regex:this.createRegexValid('call'),
          data:{},
          directive:{
            directiveName:'directive-call',
            onInit:(el,attr,option)=>{
              const {value:func} =option.attachment
              if(option.opt=='class'){
                if(typeof func!='function'){
                  console.warn(`In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' must be a constructor `);
                  throw `In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' must be a constructor `
                }
                try{
                  new func({el,handler:option.handler,opt:'class'})
                }catch(e){
                  console.warn(`In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' is not a constructor`);
                  throw `In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' is not a constructor `
                }
              }else if(option.opt=='function' || option.opt=='func'||option.opt==undefined){
                if(typeof func!='function'){
                  console.warn(`In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' must be a function`);
                  throw `In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' must be a function `
                }
                try{
                  func.call(el,{el,handler:option.handler,opt:'function'})
                }catch(e){
                  console.warn(`In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' ${e.message}`);
                  throw `In ${el.localName}[${attr.name}='${attr.value}'] : '${attr.value}' ${e.message} `
                }
              }
            },
          }
        },
      ]
      static #directiveCustom=[]
      static getByName=function(directiveName){
        return this.#directiveNative.find(corresp=>corresp.directiveName==directiveName)
                ||this.#directiveCustom.find(corresp=>corresp.directiveName==directiveName)
      }
      static getByRegex=function(stringExpression,handler){
        return this.#directiveNative.find(corresp=>corresp.regex.test(stringExpression))
              || this.directiveComponent?.[handler?._el?.instanceID]?.find(corresp=>corresp.regex.test(stringExpression))
              || this.#directiveCustom.find(corresp=>corresp.regex.test(stringExpression))
      }
      static hasRegex=function(reg){
        if(!reg)return false
        return this.#directiveNative.find(corresp=>corresp.reg==reg)
        || this.#directiveCustom.find(corresp=>corresp.reg==reg)
      }

      static isDirectiveValid=function({directiveName,onInit,reg}){
        if (!reg)
            return console.warn("directive.reg is not defined");
        if (!directiveName)
            return console.warn("directive.directiveName is not defined");
        if (typeof onInit != "function")
            return console.warn(
              "directive.onInit is not defined or not a function"
            );
        if (this.getByName(directiveName))
            return console.warn("directive.directiveName is already exist");
        if (this.hasRegex(reg))
            return console.warn("directive.regex is already exist");
        return true
      }
    }
    attachFragment(htmlElement,handler,dico={dynamic:{},stat:{}},option={}){
      if (Core.isDomElement(htmlElement)&&htmlElement.getAttributeNode("no:rend")) return;
      [...htmlElement.childNodes].forEach(child=>{
        if(child.nodeType==8)return false
          if(Core.isDomText(child)){
            this.HTMLText.attachData(child, handler,dico,option)
            return false
          }
          this.attachDirective(child, handler,dico,option)
          if(option.rendChild)this.attachFragment(child,handler,dico,option);
          return true
      })
      return option
    }
    attachDirective(htmlElement,handler,dico={dynamic:{},stat:{}},option={}){
      const attrs=[...htmlElement?.attributes??[]]
      var rendChild=true
      const listEventListener=[]
      const listFuncRemoveEvent=[]
      var hasFindDirectiveFor=false
      const directiveController=htmlElement.getAttribute('directiveController')
      attrs.forEach(attr=>{
        const directiveHandler=this.HTMLDirective.getByRegex(attr.name,handler)
        if(!hasFindDirectiveFor && directiveHandler){
          const pc=new (new Core).ElConsole(htmlElement,handler.localName,'Directive')
          pc.attrName=attr.name
          const directiveName=attr.name.slice(0,attr.name.indexOf(':') != -1?attr.name.indexOf(':'):undefined)
          if(directiveName=='for') hasFindDirectiveFor=true
          const opts=attr.name.slice(attr.name.indexOf(':')+1).split('.').filter(e=>e)
          const {data,directive }=directiveHandler
          var attachment={}
          const dicoD= dico.dynamic
          const getPathD=()=>{
            const list=attr.value.split('.')
            if(list.length==1)return dicoD[attr.value]??attr.value
            const pathD=dicoD?.[list[0]]
            if(!pathD) return attr.value
            return pathD+attr.value.slice(list[0].length)
          }
          if(attr.value in dico.stat){
            let value=dico.stat?.[attr.value]
            attachment={
              hasFinded:true,
              path:attr.value,
              args:[],
              name:attr.value,
              value,
              firstState:dico.stat,
              lastState:dico.stat
            }
          }else{
            attachment=handler.$getStateByPath(getPathD())
          }
          directiveHandler.restriction?.forEach(rule=>{
            pc.handler=handler
            pc.attr=attr
            pc.target=attachment.value
            pc.logTitle='Directive.'+(directiveName||'bind')
            pc.lastState=attachment.lastState
            pc.nameState=attachment.name
            const logs=pc.getLogByRule(rule)
            if(logs){
              console.warn(...logs[0]);
              throw logs[1]
            }
          })
          const option={
            handler,directiveName,opts,data,pc,attachment,directiveController,
            opt:opts[0],
            onValueChange:null,
            onEventRemove:null
          }
          const {lastState,name} =attachment
          const onChange=(ev)=>{
            if(['for'].includes(directiveController))return option.removeEvent();
            option?.onValueChange?.(ev)
          }
          const removeEvent=()=>{
            option?.onEventRemove?.()
            return ev._remove()
          }
          const ev=lastState?.$on?.change?.(name,onChange,removeEvent)
          if(ev){
            ev.attachDirective=directiveName||'bind'
            ev.elementTarget=htmlElement
            ev.attributeTarget=attr
            ev.attributeValue=attr.value
            ev.attachmentValue=attachment.value
            listEventListener.push(ev)
            listFuncRemoveEvent.push(removeEvent)
            option.removeEvent=removeEvent
          }
          directive.onInit.call(handler,htmlElement,attr,option)
          Object.assign(directiveHandler.data,data)
          if(this.HTMLDirective.listDirectiveNoRendChild.includes(directiveName))rendChild=false;
          htmlElement.removeAttribute(attr.name)
        }
      })
      htmlElement.removeAttribute('directiveController')
      option.rendChild=rendChild
      option.listEventListener=[...option?.listEventListener??[],...listEventListener]
      option.listFuncRemoveEvent=[...option?.listFuncRemoveEvent??[],...listFuncRemoveEvent]
      return {rendChild,listEventListener,listFuncRemoveEvent}
    }
    attachElement(htmlElement,handler,dico={dynamic:{},stat:{}}){
      if(htmlElement.nodeType==8)return
      if(!handler.$isTrap){
        console.warn('the handler must an instance of Domlib.TrapLib or Traper');
        throw 'the handler must an instance of Domlib.TrapLib or Traper'
      }
      var option
      if(Core.isDomElement(htmlElement)) {
        if (htmlElement.attributes.length) {
          option=this.attachDirective(htmlElement,handler,dico);
          if(!option.rendChild) return
        }
      }
      if(!Core.isDomElement(htmlElement) && !Core.isDomFragment(htmlElement)) return;
      return this.attachFragment(htmlElement,handler,dico,option);

    }
    static #core = null;
    static fastHandler=null
    defineElement(builder, builderType = "class") {
      const component = new this.HTMLComponent(builder, builderType);
      const core=new Domlib.#Core
      component.removeDirectiveComponent=core.HTMLDirective.removeDirectiveComponent
      component.getDirectiveComponent=core.HTMLDirective.getDirectiveComponent
      var HTMLextends = HTMLElement;
      HTMLextends =builder.extend? document.createElement(builder.extend).constructor:HTMLextends
      const defElement = class extends HTMLextends {
        #handler;
        #instanceID
        get instanceID(){return this.#instanceID}
        constructor(_props,...children) {
          super();
          this.#instanceID=this.localName+"-"+parseInt(Math.random()*10**10)
          Domlib.__el= this;
          Domlib.__component=component
          Domlib.__idEl=this.#instanceID
          component.instances[this.#instanceID]={}
          this.#handler =new Domlib.TrapLib(new component.builder());
          component.instances.handler=this.#handler
          this.#handler._self=this.#handler
          this.#handler._el = this;
          this.#handler.localName = this.localName;

          component.initChildrens(this, this.#handler,children);
          component.initProps(this, this.#handler,_props);

          const fastHandler=Core.fastHandler
          component.initParentAndChilds(fastHandler,this.#handler)
          var rend = this.#handler.render.call(this.#handler,this.#handler) || `<h1>Hello ${this.localName} </h1>`;
          
          if(typeof rend=='object' && !Core.isDom(rend)){
            const oldRender=this.#handler.render
            // Object.assign(this.#handler,rend)
            for(let at in rend){
              this.#handler[at]=rend[at]
            }
            rend = this.#handler.render.call(this.#handler,this.#handler) || `<h1>Hello ${this.localName} </h1>`
          }
          
          this.#handler._template = this.attachShadow({mode: 'open'});
          Core.fastHandler=this.#handler

          component.initDirecctive(this.#instanceID,this.#handler._directives)

          const evDirecive=this.#handler._directives.$on.change('*',(ev)=>{
            if(!ev.$option.oldValue){
              component.initDirecctive(this.#instanceID,{[ev.$option.key]:ev.$option.newValue})
            }else{
              console.warn('the directive "'+ev.$option.key+'" has already defined , cette nouvelle changement ne va pas etre prise en compte');
            }
          })
          const evDirectiveRemove=this.#handler._directives.$on.delete('*',(ev)=>{
            const listD=component.getDirectiveComponent(this.#instanceID)
            if(!listD) return;
            const index=listD.findIndex(d=>d.reg==ev.$option.key)
            if(index<0) return;
            listD.splice(index,1)
          })
          if (Core.isDom(rend)) {
            this.#handler._template.append(rend);
          } else {
            this.#handler._template.innerHTML = rend;
          }
          Core.fastHandler=fastHandler
          component.instances[this.#instanceID].dispatchEvent('onBeforeMounted',this.#handler)
          const eventListener=core.attachFragment(this.#handler._template,this.#handler)
          eventListener.listFuncRemoveEvent??=[]
          eventListener.listFuncRemoveEvent.push(evDirecive._remove,evDirectiveRemove._remove)

          component.instances[this.#instanceID].eventListener=eventListener
          component.instances[this.#instanceID].dispatchEvent('onMounted',this.#handler)          
        }
        disconnectedCallback(){
          component.instances[this.#instanceID].dispatchEvent('onDisconnected',this.#handler)
        }
        connectedCallback(){
          component.instances[this.#instanceID].dispatchEvent('onConnected',this.#handler)
        }
        adoptedCallback(){
          component.instances[this.#instanceID].dispatchEvent('onAdopted',this.#handler)
        }
        attributeChangedCallback(){}
     
      };
      
      customElements.define(builder.localName, defElement, {
        extends: builder.extend || undefined,
      });
      return defElement
    }
    static isDom = function (el) {
      if (Core.isDomElement(el)) return true;
      if (Core.isDomFragment(el)) return true;
      if (Core.isDomText(el)) return true;
      return false;
    };
    static isDomFragment = function (docFrag) {
      try {
        if (
          docFrag.nodeType == 11 &&
          docFrag.querySelector &&
          docFrag.appendChild
        ) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    };
    static isDomText = function (element) {
      if (element && element.nodeName == "#text" && element.nodeType == 3)
        return true;
      return false;
    };
    static isDomElement = function (element) {
      if (!element) return false;
      try {
        if (element.tagName && element.localName && element.nodeType) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    };
  };
  static TrapLib =this.#Core.TrapLib
  static Element = class DomlibElement {
    static localName = "";
    static extend = "";
    constructor() {
      if(this.constructor==DomlibElement){
        console.warn(''+`Désolé,tu ne peux pas instancier un objet avec cette constructeur parce ce que c'est une class Abstraite`);
        throw `sorry, you can't instantiate an object with this constructor because it's an Abstract class`
      }
      const el = Domlib.__el;
      delete Domlib.__el;
      const component = Domlib.__component;
      delete Domlib.__component;
      const idEl = Domlib.__idEl;
      delete Domlib.__idEl;
      this._props = new Domlib.TrapLib({},{
        onChange: (option, _target, targProxy) => {
          Object.defineProperty(
            targProxy,
            option.key,
            Object.getOwnPropertyDescriptor(_target, option.key)
          );
          if(typeof option.value!='object'){
            el.setAttribute(option.key, option.value);
          }
        },
        onDelete: (option) => {
          el.removeAttribute(option.key);
        },
      })
      this._children=[]
      this._ref={}
      this._directives={}
      this._self
      const instance=component?.instances[idEl]??{}
      instance.events={
        onBeforeMounted:[],
        onMounted:[],
        onConnected:[],
        onDisconnected:[],
        onAdopted:[],
        onAfterDestroy:[],
        onBeforeDestroy:[],
      }
      instance.dispatchEvent=(eventName,data)=>{
        const listEv=instance.events[eventName]
        if(!listEv) return 
        listEv.forEach(fn=>{
          if(typeof fn=='function'){
            const result=fn?.(data)
            const listNoReturnFunc=['onBeforeDestroy','onAfterDestroy']
            if(typeof result=='function' && !listNoReturnFunc.includes(eventName)){
              this.onBeforeDestroy(result)
            }
          }
        })
      }
      this.constructor.prototype.destroy=(()=>{
        if(idEl,component.instances[idEl].eventListener){
          const listFunc=component.instances[idEl].eventListener
          component.instances[idEl].dispatchEvent('onBeforeDestroy',this)
          listFunc.listFuncRemoveEvent.forEach(fn=>fn())
          this._template.innerHTML=""
          this._el.remove()
          component.removeDirectiveComponent(idEl)
          component.instances[idEl].dispatchEvent('onAfterDestroy',this)
          console.log('delete',idEl);
          return true
        }
        console.log('yoo');
        return false
      }).bind(this)
      this.constructor.prototype.createDirective=(directiveName,onInit,option={restriction:[],data:{}})=>{
        this._directives[directiveName]={directiveName,onInit,...option}
      };
      this.constructor.prototype.onMounted=(funcCallback)=>{
        instance.events.onMounted.push(funcCallback)
      }
      this.constructor.prototype.onBeforeMounted=(funcCallback)=>{
        instance.events.onBeforeMounted.push(funcCallback)
      }
      this.constructor.prototype.onConnected=(funcCallback)=>{
        instance.events.onConnected.push(funcCallback)
      }
      this.constructor.prototype.onDisconnected=(funcCallback)=>{
        instance.events.onDisconnected.push(funcCallback)
      }
      this.constructor.prototype.onAdopted=(funcCallback)=>{
        instance.events.onAdopted.push(funcCallback)
      }
      this.constructor.prototype.onBeforeDestroy=(funcCallback)=>{
        instance.events.onBeforeDestroy.push(funcCallback)
      }
      this.constructor.prototype.onAfterDestroy=(funcCallback)=>{
        instance.events.onAfterDestroy.push(funcCallback)
      }
      return new Domlib.TrapLib(this)
    }
    render(handler){}
  };
  static appendChild = function (aChild, aParent = document.body) {
    try {
      return aParent.appendChild(aChild);
    } catch (e) {
      return document.body.appendChild(aChild);
    }
  };
  static createElement = function (HTMLString = "") {
    const strToHTMLElement = (str) => {
      const doc=document.createRange().createContextualFragment(str)
      return doc.children.length>1?doc:doc.firstElementChild
    };
    if (this.#Core.isDom(HTMLString)) return HTMLString;
    if (typeof HTMLString == "function")
      return Domlib.createElement(HTMLString());
    if (Array.isArray(HTMLString)) {
      return HTMLString.map((str) => Domlib.createElement(str));
    }
    if (typeof HTMLString == "object") {
      try {
        return Domlib.createElement(JSON.stringify(HTMLString))
      } catch (error) {
        return Domlib.createElement(HTMLString?.toString?.()||"[Object "+HTMLString?.constructor?.name+"]")
      }
    }
    return strToHTMLElement(HTMLString) || new Text(HTMLString);
  };
  static createDirective = function (directiveName,onInit,option={restriction:[],data:{}}) {
    return (new this.#Core).HTMLDirective.create(directiveName,onInit,option)
  };
  static build = function (Constructor) {
    if(!Traper.isConstructor(Constructor)){
      const msg=Constructor.name+"handler must be a constructor"
      console.warn(msg);
      throw msg
    }
    if (Object.getPrototypeOf(Constructor) !== Domlib.Element) {
      console.warn(`the class ${Constructor.name} must extends Domlib.Element`);
      throw `the class ${func.name} must extends Domlib.Element`;
    }
    if (Constructor.localName.search(/^[a-z]+-[a-z]+$/) === -1) {
      console.warn("localName `" + Constructor.localName + "` is not valid ");
      console.log('([a-z]-[a-z]) Ex : "my-el" ');
      throw "localName `" + Constructor.localName + "` is not valid ";
    }
    return new this.#Core().defineElement(Constructor);
  };
  static el=function(localName, renderCallback, extend = "") {
    if(typeof renderCallback!='function'){
      const message="renderCallback must be a function"
      console.warn(message);
      throw message
    }
    return this.build(
      class el extends Domlib.Element {
        static localName = localName;
        static extend = extend;
        static isFunElement=true
        render = renderCallback;
      }
    );
  }
}