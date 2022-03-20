
///* <reference no-default-lib="true"/>

type Callback<Args,Return>=(...args:Args[])=>Return
type Cle<T>=keyof T 
type ListOn={get:any ,set:any,call:any,change:any,delete:any,emit:any}
type TrapKey<Target>=('*')|Cle<Target>|(Cle<Target>|'*')[]

type onTrap<Target,Type extends Cle<ListOn>>=<Data,Key extends TrapKey<Target>,TrpListener=TrapListener<Target,Type,Key>>(
    key:Key,
    func:(this:TrpListener,ev:TrpListener)=>void,
    toRemove?:boolean|(()=>boolean),
    data?:Data
)=>TrpListener


type TrapListener<Target,Type extends Cle<ListOn>,Key=Cle<Target>,Data=any>={
    data?:Data
    readonly _type:Type;
    readonly _key:Key;
     _func(ev:TrapListener<Target,Type>):void;
    readonly _index:number;
    readonly _eventLen:number;
    readonly _originalTarget:Target&TrapInstance<Target>
     _remove():void
    $option:{
        break:false,
        key:Cle<Target>
        value:any,
        newValue?:any,
        oldValue?:any,
        [x:PropertyKey]:any
    }
}


type TrapInstance<Target>={
    readonly $on:{
        [type in keyof ListOn]: onTrap<Target,type>
    }
    readonly $emitEvent(eventName:string,option={}):void
    readonly $TrapListener:{
        add(handler:{key:cle<Target>|cle<Target>[],func:onTrap<Target,cle<Target>|cle<Target>[]>,type:cle<listOn>}):TrapListener<Target>|TrapListener<Target>[];
        get(key:cle<Target>|cle<Target>[]='*',type:cle<listOn>="*"):TrapListener<Target>[]
        remove(type:cle<listOn>,key:cle<Target>,func:Function):boolean
    }
    readonly $isTrap:true
    readonly $getStateByPath:(path:string,...data:Trap<not<{},HTMLElement>>[])=>{
        hasFinded:false|true,
        path:string,
        args:[],
        name:undefined|string,
        value:undefined|lastState[name],
        firstState:(null|Trap<not<target,HTMLElement>>),
        lastState:null|Trap<not<{},HTMLElement>>
      }
}

type Trap<T>=TrapInstance<T> & {
    [key in keyof T]:T[key]
}
type not<T,U>=T extends U ?never:T

type Traper={
    new<T>(target:not<T,HTMLElement>,handler?:{}):Trap<not<T,HTMLElement>>;
    isConstructor:<T>(Constructor:T)=>T extends {new():void}?true:false;
};
declare var  Traper:Traper
/*****************************************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface Domlib{
}
type onBeforeDestroy<t>=(handler?:t)=>void
type attachment<T> ={
    hasFinded:true,
    path:string|null,
    args:[],
    name:string,
    value,
    firstState:T,
    lastState:Object|null
}
type DirectiveOption<T> ={
    attachment:attachment<T>
    handler:T
    opts:string[]
    opt:string
    onValueChange:null|((ev:TrapListener<T>)=>void)
    onEventRemove:null|(()=>void)
}
type ob<T=any>={[x:string|number]:T}
type restriction={isNoUndefined,isTypeArray,isTypeObject,isTypeFunction}
type HTMLDirective={
    data?:ob
    restriction?:cle<restriction>
    onInit(el:HTMLElement,attr:Attr,option:DirectiveOption<{}>):void
}


interface DomlibElement  {
    render(handler:this):void
    destroy():boolean
    onMounted(callback:(handler?:DomlibElement)=>(void |(onBeforeDestroy<this>?)))
    onBeforeMounted(callback:(handler?:this)=>(void | onBeforeDestroy<this>?))
    onConnected(callback:(handler?:this)=>(void | onBeforeDestroy<this>?))
    onDisconnected(callback:(handler?:this)=>(void | onBeforeDestroy<this>?))
    onAdopted(callback:(handler?:this)=>(void | onBeforeDestroy<this>?))
    onBeforeDestroy(callback:(handler?:this)=>void)
    onAfterDestroy(callback:(handler?:this)=>void)
    createDirective(directiveName:string,onInit:(el:HTMLElement,attr:Attr,option:DirectiveOption<typeof this>)=>void,option={restriction:[],data:{}})
    _props:{[x:string|number]}
    _self:this
    _children:[]&{noSlotText:Text[],noSlot:*[],noSlotElement:{[x:string|number]:HTMLElement|DocumentFragment}}
    _ref:{[x:string|number]:HTMLElement}
    _directives:{[x:string]:HTMLDirective|HTMLDirective['onInit']}
    _el:HTMLElement
    _template:DocumentFragment
    localName:!string
}

interface el {
    [x:PropertyKey]
}
type instance<T extends Domlib.Element>= instanceDomlibElement<T>
type instanceDomlibElement<T>=Trap<not<InstanceType<T>,HTMLElement>>
declare var Domlib:{
    build<T extends {
        new(): DomlibElement,
        localName:string,
    }>(Constructor:T):new(props?:ob,...children?)=>HTMLElement;
    prototype: Domlib;
    new<T extends {new(): DomlibElement}>(handler:{el:Element,Constructor:T}):instanceType<T>;
    Element:{
        new(): DomlibElement;
        prototype: DomlibElement;
    }
    appendChild(aChild:Node, aParent:Node = document.body):void
    createElement(HTMLString = ""):HTMLElement|DocumentFragment
    createDirective(directiveName:string,onInit:HTMLDirective['onInit'],option:{data?:ob,restriction?:cle<restriction>}={restriction:[],data:{}}):void
    /**
     * 
     * @param localName Nom de l'elements personnalisé
     * @param renderCallback rendu de l'element
     * @param extend nom de tags
     * @example
     * const HTMLCount=Domlib.el('my-count',function(){
     *  this.count=0
     *  return `<h1>count:{{count}}</h1>`
     * })
     * const elCount = new HTMLCount()
     * Domlib.appendChild(elCount)
     */
    el< tagName extends keyof HTMLElementTagNameMap,
        StringValid extends `${string}-${string}`,
        CallbackReturn,
        ElThis=DomlibElement&el&TrapInstance<el>
        ,
    >
    (localName:StringValid, renderCallback:(this:ElThis,handler:ElThis)
    =>DoEvent<instanceEl<CallbackReturn,el>>|string|Node,
     extend?:tagName = ""):new(props?:ob,...children?:[])=>HTMLElement
}
type Fusion<T,U>={
    [key in keyof (T & U)]:T[key]&U[key]
}
type initType ={
    [key in keyof T ]:T[key]
}
type ObjectDomlib <T,F>=T&DomlibElement&F&TrapInstance<T&DomlibElement>
type instanceEl <T,F>={
    [key in keyof (T&F) ]:T[key] extends (...args:infer Args)=>infer Return
    ?(this:ObjectDomlib<T,F>,...args:Args)=>Return
    :T[key]&F[key]
}

type DoEvent<T>={
    [key in keyof T ]:T[key] extends (...arg:infer Args)=>infer Return
    ?<K>(this:ObjectDomlib<T,F>
        ,...arg:Args)=>Return
    :T[key]
}
 //DocumentEventMap
type evNameArg<T extends string,TrueV,FalseV>=keyof  DocumentEventMap extends T 
?TrueV:FalseV

type Concate<T1,T2>=`${T1}${T2}`
