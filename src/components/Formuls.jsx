import React, {
  Component, useReducer, useContext, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CrudContext } from '../context/ServerContext';
import Formul from './Formul';
import Bouttons from './Bouttons';
import { IconButton } from '@material-ui/core';

function reducer(state, action) {
  switch (action.fct) {
    case 'load':
      const idComp = action.context.componentCreation('Formul');
      action.context.getSchema(action.type, action.rule, idComp);
      const modifs = [];
      const orgData = [];
      const force = action.force !== undefined;
      if (action.populate) {
        action.context.populate(action.type, action.rule, action.cond, idComp, force);
      }
      for (let i = 0; i < action.rows; i++) {
        modifs[i] = action.od && action.od[i] ? action.od[i] : new Object();
        orgData[i] = action.od && action.od[i] ? action.od[i] : new Object();
      }
      const resets = state.resets + 1;
      return {
        ...state, orgData, modifs, idComp, resets,
      };
      break;
    case 'populate':
      const or = action.context.popData[action.type][action.rule][
        JSON.stringify(action.cond).replace(/"/gi, '')
      ]
        ? action.context.popData[action.type][action.rule][
          JSON.stringify(action.cond).replace(/"/gi, '')
        ].data
        : [];
      action.od.forEach((d,i)=>{ //populate with original data when type is update
        Object.keys(d).forEach(e=>{
          if(!or[i][e]){ or[i][e] = action.od[i][e] }
        })
      })
      if (or.length > action.rows) {
        for (let j = or.length; j > action.rows; j--) {
          or.pop();
        }
      }
      if (action.popOd) {
        or.map((m) => {
          if (action.hidden) {
            for (let i = 0; i < action.hidden.length; i++) {
              delete m[action.hidden[i]];
            }
          }
          return m;
        });
      }
      const mod = or.length > 0 ? or : [];
      return { ...state, orgData: or };
      break;
    case 'files':
      let files;
      if (action.fileType.includes('image')) {
        files = state.files;
      } else {
        files = state.files;
        files.delete(`${state.idComp}_${action.key}_${action.id}`);
      }
      for (let i = 0; i < action.fls.length; i++) {
        console.log("file = ",action.fls[i])
        files.append(`${state.idComp}_${action.key}_${action.id}[]`, action.fls[i]);
      }
      console.log("files = ",files)
      // frmd.append(`${state.idComp}_${action.key}_${action.id}`,action.fls);
      return { ...state, files };
      break;
    case 'change':
      const dt = [...state.modifs];
      dt[action.id] = dt[action.id] || {};
      dt[action.id][action.key] = action.val;
      action.warnings && action.warnings(dt);
      // action.warnings.call(this,action.v,action.id,action.key);
      return { ...state, modifs: dt };
      break;
    case 'changeOriginal': //des données sont injectées depuis le parent
      let stm = [...state.modifs]
      let injectionModif = action.data.map((d,i)=>{
        return {...stm[i],...d}
      })
      return {...state, modifs: injectionModif}
      break;
    case 'delete': 
      let m = [...state.modifs]
      let err = [...state.errors]
      let org = [...state.orgData]
      return {...state, modifs:m.splice(action.i,1), errors:err.splice(action.i,1), orgData:org.splice(action.i,1)}
      break;
    /*case 'addRow':
      return {...state, modifs:}
      break; */
    case 'error':
      return {...state, errors: action.errors }
      break;
    /* case 'save' :
			if(action.type === 'insert'){
				let data = [...action.modifs]
				for(let i=0; i < data.length; i++){
					Object.keys(action.context.schemas['insert'][action.rule]['columns']).map(col=>{
						if(data[i][col] === undefined) { data[i][col] = null }
					})
				}
				action.context.write([{type:'inserts',rule:action.rule,data}],
					(rep)=>{ alert(rep) },action.idComp)
			}
			else if(action.type === 'update'){
				action.context.write([{type:'update',rule:action.rule,data:action.modifs[0]}],
					(rep)=>{ alert(rep) },action.idComp)
			}
		break; */
    default:
      return false;
  }
}
let pop = [];
const Formulaire = (props) => {
  const context = useContext(CrudContext);
  const {
    type,
    rule,
    rows,
    cond,
    title, //titre auquel on pourra ajouter le N° de formulaire
    hidden,
    condSave,
    populate,
    warnings,
    callback,
    disabled,
    od,
    popOd,
    complement, //qui va etre passé à Formul afin de pouvoir ajouter des extra functions aux différents input selon leur key
    formStyle,
    deletable,
    add
  } = props;
  const c = cond || [];
  // warnings est 1 fct qui prend en param les val, id, key des modifs et avec call(this) prend Formulaire comme paramètre(accès aux props et states)
  // son but est d'éxecuter un callback qui suit les changements sur les formulaires (pour les exceptions par exp)
  // exp: lim = (v,id,key)=>{ if(key==='cost' && v > this.state.orgData[id]['total']){ alert("cost ne peut dépasser total !!") } }
  // populate est un booléen qui dit s'il faut charger les données selon "cond"
  // disabled est un array qui déterminera les keys disabled, si [] ils sont tous disabled
  // popOd est 1 bool qui détermine si le populate doit etre intégrer
  const [state, dispatch] = useReducer(reducer, {
    idComp: '',
    schema: {},
    orgData: od || [],
    resets: 0,
    modifs: [],
    files: new FormData(),
    errors: []
  });
  //const r = rows || 1;
  if (
    context.popData[type][rule]
    && context.popData[type][rule][JSON.stringify(c).replace(/"/gi, '')]
  ) {
    pop = context.popData[type][rule][JSON.stringify(c).replace(/"/gi, '')].data || [];
  }
  let p = populate;
  if (populate === undefined) {
    p = type === 'update';
  }
  useEffect(() => {
    if (od) {
     /* od.map((j) => {
        for (let i = 0; i < hidden.length; i++) {
          delete j[hidden[i]];
        }
        return j;
      }); */
      dispatch({
        fct: 'load', od, cond: c, context, populate: p, type, rule, rows,
      });
    } else { console.log("load formulaire preparing....")
      dispatch({
        fct: 'load', od, cond: c, context, populate: p, type, rule, rows,
      });
    }
  },[]);
  useEffect(()=>{ if(od){
     dispatch({fct: 'changeOriginal', data: od})
    }
  },[JSON.stringify(od)])
  useEffect(() => {
    if (p && context.popData[type][rule] && pop.length > 0) {
      dispatch({
        fct: 'populate', cond: c, rows, context, type, rule, od, popOd, hidden,
      });
    }
  }, [pop]);
  const changeFormul = (val,id,key) =>{
    
    if(state.errors[id] && state.errors[id][key]){
      let er = [...state.errors]
      delete er[id][key]
      dispatch({fct:"error",errors:er})
    }
    let w = warnings || null
    dispatch({
      fct: 'change', warnings:w, val, id, key,
    })
  }
  const frms = () => {
    const f = [];
    // let sch = context.schemas[type][rule] ? context.schemas[type][rule]['columns'] : {}
    for (let i = 0; i < rows; i++) {
      f.push(
        <div style={{
          display: 'flex', justifyContent: 'start', flexWrap: 'wrap', padding: '5px',
        }}
        >
          {context.schemas[type][rule] ? (
            <Formul
              id={i}
              title={`${title || ""} ${rows > 1 ? i+1 : ''}`}
              hidden={hidden || []}
              inputs={context.schemas[type][rule].columns || {}}
              orgData={{ ...state.orgData[i] } || {}}
              onChange={(val, id, key) => changeFormul(val,id,key) }
              handleFiles={handleFiles}
              propError={state.errors[i] || {}}
              // warnings = {warnings || {}}
              resets={state.resets} // mettre à jour les sous-components si load ou reset
              disabled={disabled}
              complement={complement}
              onDelete={deletable ? ()=>onDelete(i) : null}
            />
          ) : (
            <br />
          )}
        </div>,
      );
    }
    return f;
  };
  const handleFiles = (fls, id, key) => {
    // fls est le FileList
    const fileType = context.schemas[type][rule].columns[key].type;
    dispatch({
      fct: 'files', fls, key, id, fileType,
    });
  }
  const onDelete = (i) =>{
    dispatch({fct: 'delete', i})
  }
  const save = () => {
    let data = type === "insert" ? [...state.modifs] : (state.modifs[0] || {});
    let q = '';
    let undefinedRequired = false
    for (let i = 0; i < data.length; i++) {
      Object.keys(context.schemas[type][rule].columns).map((col) => {
        if (!data[i][col] && context.schemas[type][rule].columns[col].required) {
          undefinedRequired = true;
          alert(`Le champ ${col} est requis !`);
          let er = [...state.errors]
          er[i] = {...er[i], [col]: "Champ requis" }
          dispatch({ fct:'error', errors: er})
          document.querySelector("[name="+col+i+"]").focus()
        }
      });
    }
    if(!undefinedRequired){
      if (type === 'insert') {
        q = JSON.stringify([{
          type: 'insert', rule, idComp: state.idComp, data,
        }]);
      }
      else if (type === 'update') {
        const cs = condSave || c;
        q = JSON.stringify([{
          type: 'update', rule, idComp: state.idComp, data, where: cs,
        }]);
      }
      const fd = state.files;
      /* let fd = new FormData();
      Object.keys(state.files).map(f=>{
        fd.append(f,state.files[f])
      }) */
      console.log("q = ",q,data,state.modifs)
      fd.set('q', q);
      context.write(
        fd,
        (rep, status) => {
          let d = type === "insert" ? data : [data] //pour que ça soit tjr un array 
          saveCallback(rep, status,d);
        },
        state.idComp,
      );
    }
  };
  const saveCallback = (rep, status, d=[]) => {
    // le props callback peut etre introduit, sinon recharger avec forcing
    if(callback) {
      callback(rep, status, d);
    }
    else {
      if (status > 299) {
        alert(`Erreur \n${rep}`);
      }
      else{
        dispatch({
          fct: 'load',
          od,
          force: true,
          cond: c,
          context,
          populate: p,
          type,
          rule,
          rows,
        });
      }      
    }
  };

  return (
    <form style={formStyle} method="post" action="/" encType="multipart/form-data">
      {/* add && <IconButton></IconButton> */}
      {frms()}
      <div style={{ margin: '20px', display: 'flex', justifyContent: 'space-around' }}>
        <Bouttons
          color="secondary"
          icon="clear"
          label="Annuler"
          // disabled={JSON.stringify(state.orgData)===JSON.stringify(state.modifs) || state.modifs===[]}
          callback={(e) => dispatch({
            fct: 'load', od, cond: c, context, populate: p, type, rule, rows,
          })}
        />
        <Bouttons
          color="primary"
          icon="save"
          label="Confirmer"
          // disabled={JSON.stringify(state.orgData)===JSON.stringify(state.modifs) || state.modifs===[]}
          callback={(e) => save()}
        />
      </div>
    </form>
  );
};

Formulaire.propTypes = {
  /**
   * Type de formulaire (insert, update)
   */
  type: PropTypes.string.isRequired,
  /**
   * Rule sur le serveur
   */
  rule: PropTypes.string.isRequired,
  rows: PropTypes.number,
  cond: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    operator: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
  })),
  title: PropTypes.string, //titre auquel on pourra ajouter le N° de formulaire
  hidden: PropTypes.arrayOf(PropTypes.string),
  condSave: PropTypes.func,
  populate: PropTypes.bool,
  warnings: PropTypes.func,
  callback: PropTypes.func,
  disabled: PropTypes.arrayOf(PropTypes.string),
  od: PropTypes.arrayOf(PropTypes.shape({})),
  popOd: PropTypes.bool,
  complement: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    label: PropTypes.string,
    fct: PropTypes.func
  })) , //qui va etre passé à Formul afin de pouvoir ajouter des extra functions aux différents input selon leur key
  formStyle: PropTypes.object,
  deletable: PropTypes.bool,
  add: PropTypes.bool
}

Formulaire.defaultProps = {
  rows: 1,
  type: 'insert',
  od: [],
  complement: [],
  deletable: false,
  add: false
}

export default Formulaire;

/* exemple :
	<Formulaire rule="Technicien" type="update"
       cond={[{label:'Id',operator:'in',value:[1,2,3]},{label:'Nom',operator:'like',value:'e'}]}
       //rows={2}
    />
*/
