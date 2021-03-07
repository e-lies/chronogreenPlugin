import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSize } from "../reducers/Hooks";
import Inputs from "./Inputs";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography, Tooltip, IconButton, Icon } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  form: { marginTop: "10px", marginBottom: "10px", padding: "8px" },
  grid: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexWrap: "wrap",
    minWidth: "50%",
    //justifyContent: 'space-around',
    marginTop: "12px"
  },
  typo: {
    padding: "8px",
    color: theme.palette.text.secondary
  },
  title: { 
    display: 'block',
    margin: 12,
    color: theme.palette.info.dark
 }
}));
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
const Formul = props => {
  //ne représente qu'un seul formulaire
  const {
    id,
    title,
    propError,
    resets,
    inputs,
    orgData,
    keys,
    onChange,
  	handleFiles,
	  complement,
    disabled,
    hidden,
    onDelete
  } = props; //inputs est le column du schema et data les données par défaut pour les update
  //keys sont les colonnes à afficher (si pas toutes)
  const classes = useStyles();
  const [data, setData] = useState(orgData);
  const [errors, setError] = useState({});
  //const [width,setWidth] = useState(100)
  const { width, height } = useSize(`formul${id}`);
  let ks = keys === undefined ? Object.keys(inputs) : keys;
  useEffect(() => {
    /*let widthCoef = document.querySelector(`.${classes.grid}`) ? document.querySelector(`.${classes.grid}`).clientWidth-50 : document.body.clientWidth-100
			setWidth(widthCoef) */
    setData(orgData);
    console.log("original comes back");
  }, [JSON.stringify(orgData), resets]);
  /*useEffect(()=>{
    setError({...errors,...propError})
  },[JSON.stringify(propError)])*/
  const handleChange = (e, key) => {
    let t = inputs[key]["type"];
    let val = data[key];
    let v = null;
    let dt = { ...data };
    let err = { ...errors };
    if (t.includes("date") || t.includes("time")) {
      val = e;
      v =
        t === "time"
          ? val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds()
          : val;
      onValidate(id,key,e)
    } else if (inputs[key].type.includes("address")) {
      val = e;
      v = val;
      onValidate(id,key,e)
    } else if (inputs[key].type === "geo") {
      if (typeof e === "object") {
        //depuis maps
        val = JSON.stringify(e);
        v = val;
        onValidate(id,key,e)
      } else {
        /*let jval = val;
				jval[e.getAttribute("coor")] = e.target.value;
				val = JSON.stringify(jval);*/
        v = val;
      }
    } else if (t.includes("file") || t.includes("image")) {
      let fls = document.getElementById(key + id).files;
      handleFiles(fls, id, key);
      let names =
        dt[key] && !t === "image" && !t === "file" ? dt[key].split(",") : []; //liste des fichiers en cours
      for (let i = 0; i < fls.length; i++) {
        if (!names.includes(fls[i]["name"])) {
          names.push(fls[i]["name"]);
        }
      }
      val = names.join(",");
      v = val;
      onValidate(id,key,e)
    }
    else if (e === null) {
      //cas du vidage d'un <Select
      val = null;
    }
    else {
      val = e.value || e.target.value;
      v = val;
    }
    if (t.includes("int") || t.includes("float") || t.includes("decimal")) {
      if (!isNumeric(val)) {
        err[key] = true;
        setError(err);
      } else {
        delete err[key];
      }
    }
    //ajouter une condition qui vérifie si les warnings sont vrais pour etre ajouté à "errors"
	  dt[key] = val;
    setData(dt);
    onChange(v, id, key);
  };
  const onRemoveFile = (e, name, key) => {
    e.preventDefault();
    let data = { ...data };
    let vf = data[key] ? data[key].split(",") : [];
    data[key] = vf
      .filter(e => {
        return e !== name;
      })
      .join(",");
    setData(data);
    onChange(data[key], id, key);
  };
  const onValidate = (key,e) =>{
    if(e.which === 13){
      onValidate(id,key,e)
    }
  }
  return (
    <div>
     <Typography className={classes.title} variant="h5"> {title || ""} </Typography>
      <Grid
        container
        className={classes.grid}
        spacing={2}
        key={`key${id}`}
        id={`formul${id}`}
      >
        {Object.keys(inputs).map((inp, i) => {
          if (ks.includes(inp) && !hidden.includes(inp)) {
            return ( <div style={{display:'flex',justifyContent:'space-between'}}>
              <Inputs
                key={`${inp}${id}`}
                widthCoef={width}
                autoFocus={i === 0}
                id={`${inp}${id}`}
                disabled={
                  disabled !== undefined &&
                  (disabled.includes(inp) || disabled === [])
                }
                type={inputs[inp].type}
                possibles={inputs[inp].possibles || []}
                length={
                  inputs[inp].length === undefined ? 50 : inputs[inp].length
                }
                icon={inputs[inp].icon}
                value={data[inp] || ""}
                label={inputs[inp].label}
                error={errors[inp] || propError[inp] }
                required={inputs[inp].required || false}
                onChange={e => handleChange(e, inp)}
                onRemove={
                  inputs[inp].type.includes("image")
                    ? (e, name) => onRemoveFile(e, name, inp)
                    : null
                }
                onValidate={e=>onValidate(inp,e)}
              />
        <div>
        {
          complement[inp] && (
            <Tooltip title={complement[inp].label || null}>
              <IconButton color="primary" onClick={e=>complement[inp].fct(inp,data[inp],id)} >
                <Icon> {complement[inp].icon} </Icon>
              </IconButton>
            </Tooltip>
            )
        }
        </div>
      </div>)
      }})}
      { onDelete && ( <IconButton color="error" onClick={onDelete()}> <Icon>delete</Icon> </IconButton> ) }
      </Grid>
    </div>
  );
};
Formul.propTypes = {
  /**
   * id du formulaire
   */
  id: PropTypes.number.isRequired,
  /**
   * Tire du formulaire
   */
  title: PropTypes.string,
  /**
   * Les champs contenants des erreurs héritées
   */
  propError: PropTypes.shape({}),
  /**
   * La partie columns du schema des clés concernées
   */
  inputs: PropTypes.shape({}).isRequired,
  /**
   * chaque incrémentation (depuis le parent provoque un reset)
   */
  resets: PropTypes.number,
  /**
   * Représente les données d'origine de ce formulaire
   */
  orgData: PropTypes.arrayOf(PropTypes.shape({})),
  /**
   * Les clés du schéma à utiliser (toutes les keys de inputs si undefined)
   */
  keys: PropTypes.arrayOf(PropTypes.string),
  /**
   * Fonction à éxecuter à la modification d'un élement du formulaire
   */
  onChange: PropTypes.func,
  /**
   * Callback quand un input est confirmé
   */
  onValidate: PropTypes.func,
  /**
   * Callback quand un input files change
   */
  handleFiles: PropTypes.func,
  /**
   * Ajouter des fonctions complémentaires sur certains inputs (create, detail...) sous forme d'IconButton
   */
  complement: PropTypes.shape({}),
	// arrayOf(  
  	/** Text au survol de l'icone 
	  label: PropTypes.string,
	  /** icone 
	  icon: PropTypes.string,
	  /** style de l'icone 
	  style: PropTypes.object,
	  /** Fonction à déclencher, elle prend la key, value, et le row comme paramètres 
	  fct: PropTypes.func,
  })*/
  /**
   * Liste des keys disabled
   */
  disabled: PropTypes.array,
  hidden: PropTypes.array,
  /**
   * la ligne est-elle supprimable 
   */
  onDelete: PropTypes.func
};
Formul.defaultProps = {
  resets: 0,
  hidden: [],
  disabled: [],
  complement: {},
  propError: {},
  onDelete: null
};
export default Formul;
