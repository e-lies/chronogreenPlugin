import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSize } from "../reducers/Hooks";
import { format } from 'date-fns'
import Inputs from "./Inputs";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography, Tooltip, IconButton, Icon } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  form: { marginTop: "10px", marginBottom: "10px", padding: "8px" },
  grid: {
   // backgroundColor: theme.palette.background.default,
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    padding:8,
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
const FormRow = props => {
  //ne représente qu'un seul formulaire
  const {
    id,
    title,
    errors,
    inputs,
    data,
    keys,
    onChange,
    onEnter,
  	handleFiles,
	  complement,
    disabled,
    hidden,
    onDelete,
    inputProps
  } = props; //inputs est le column du schema et data les données par défaut pour les update
  //keys sont les colonnes à afficher (si pas toutes)
  const classes = useStyles();
  const [error, setError] = useState({});
  const { width, height } = useSize(`formul${id}`);
  const {screenWidth} = useSize()
  let ks = keys === undefined ? Object.keys(inputs) : keys;
  
  const handleChange = (e, key) => {
    let t = inputs[key]["type"];
    let val = data[key];
    let v = null;
    let dt = { ...data };
    //let err = { ...errors };
    if (t.includes("date") || t.includes("time")) {
      val = e;
      v =
        t === "time"
        ? val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds()
        : (t.includes("datetime") && Date.parse(val) > 1 ? format(val, 'yyyy-MM-dd HH:mm:ss'): val)
      onEnter(key,v)
    } else if (inputs[key].type.includes("address")) {
      val = e;
      v = val;
      onEnter(key,v)
    } else if (inputs[key].type === "geo") {
      if (typeof e === "object") {
        //depuis maps
        val = JSON.stringify(e);
        v = val;
      } else {
        v = val;
      }
      onEnter(key,v)
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
      onEnter(key,v)
    }
    else if (e === null) {
      //cas du vidage d'un <Select
      val = null;
    }
    else {
      if(t.includes("foreign") || t.includes("autocomplete")){
        onEnter(key,v)
      }
      val = e.value !== undefined ? e.value : e.target.value;
      v = val;
    }
    /*if (t.includes("int") || t.includes("float") || t.includes("decimal")) {
      if (!isNumeric(val)) {
        err[key] = true;
        setError(err);
      } else {
        delete err[key];
      }
    }*/
    //ajouter une condition qui vérifie si les warnings sont vrais pour etre ajouté à "errors"
	dt[key] = val;
    onChange(v, id, key);
  };
  /*const onRemoveFile = (e, name, key) => {
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
  };*/
  const onValidate = (key,e) =>{
    if(e.which === 13){
      let val = e.value || (e.target ? e.target.value : e)
      onEnter(key,val)
    }
  }
  return (
    <div style={{width:'100%'}}>
     <Typography className={classes.title} variant="h5"> {title || ""} </Typography>
      <Grid
        container
        //style={{padding:8}}
        className={classes.grid}
        spacing={3}
        key={`key${id}`}
        id={`formul${id}`}
      >
        {Object.keys(inputs).map((inp, i) => {
          if (ks.includes(inp) && !hidden.includes(inp) && inputs[inp].type !== "primary") {
            return (
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
                length={inputs[inp].length}
                icon={inputs[inp].icon}
                value={data[inp] || ""}
                label={inputs[inp].label || inp}
                suffixe={inputs[inp].suffixe || null}
                error={errors(id,inp,data[inp])}
                required={inputs[inp].required || false}
                onChange={e => handleChange(e, inp)}
                onValidate={e=>onValidate(inp,e)}
                complement={complement[inp] && complement[inp](data,inp,id)}
                inputProps={inputProps[inp]}
                prop={inputs[inp].otherProps || {}}
              />
      )
      }})}
      { onDelete && ( <IconButton color="error" onClick={onDelete()}> <Icon>delete</Icon> </IconButton> ) }
      </Grid>
    </div>
  );
};
FormRow.propTypes = {
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
  errors: PropTypes.func,
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
  /**
   * Liste des keys disabled
   */
  disabled: PropTypes.array,
  hidden: PropTypes.array,
  /**
   * la ligne est-elle supprimable 
   */
  onDelete: PropTypes.func,
  /**
     *  Props à éventuellement ajouter aux inputs correspondant à certaines clés  
     */
    inputProps: PropTypes.shape({})
};
FormRow.defaultProps = {
  resets: 0,
  hidden: [],
  disabled: [],
  complement: {},
  errors: (ind,key,val)=>{return null},
  onDelete: null
};
export default FormRow;
