import React, { Component, useMemo, useRef, fragment } from "react";
import PickupLocation from "./Maps/PickupLocation";
import {
  Avatar,
  Typography,
  TextField,
  FormGroup,
  Checkbox,
  Grid,
  Card,
  Tooltip,
  Badge,
  InputLabel,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputAdornment,
  Button,
  Breadcrumbs,
  Slider,
  Select,
  MenuItem
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Icon from "@material-ui/core/Icon";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { defaultZoom, path } from "../context/Params";
import AutoCompAddress from "./Maps/AutoCompAddress";
//import ColorPicker from "material-ui-color-picker";
//import { MuiPickersUtilsProvider, TimePicker, DatePicker, DateTimePicker} from "material-ui-pickers";
//import Select from "react-select";
import SignaturePad from "react-signature-canvas";
import MaskedInput from 'react-text-mask';

const Inputs = (props) => {
  //id:int disabled: bool error:bool onChange:fct
  const {
    id,
    type,
    filtre,
    label,
    value,
    icon,
    required,
    suffixe,
    disabled,
    error,
    possibles,
    autoFocus,
    onChange,
    onValidate,
    onRemove,
    length,
    complement,
    inputProps,
    ...prop
  } = props;
  const sign = useRef(null);
  const CalculSize = (lgth=1) => {
    if (lgth < 2) {
      return {xs:6, sm:6, md:4, lg:3, xl:3};
    }
    else if (lgth < 3){
      return {xs:12 ,sm:6 ,md:6 ,lg:4 ,xl:4}
    }
    else if (lgth < 4) {
      return {xs:12, sm:12, md:6, lg:6, xl:4};
    }
    else {
      return {xs:12, sm:12,md:12, lg:12, xl:6};
    }
  }

  const typeAndLength = (t) => {
    //7 sera la valeur de tout ceux qui n'ont pas de length
    let rslt = new Object();
    rslt["contentType"] = t.replace(/(\w+)\((.+)\)/, "$1");
    rslt["detail"] =t.replace(/(\w+)\((.+)\)/, "$2").split(",");
    let between = rslt["detail"].reduce((acc, cur) => {
      return acc + parseInt(cur);
    }, 0);
    rslt["long"] = between > 0 ? between : 10; //si il y'avait des caractères entre () la condition donnera false
    return rslt;
  };

  let { contentType, detail } = { ...typeAndLength(type) };
  let long = length
  if(!length){
    if (possibles.length > 0 && contentType.includes("foreign")) {
      //pour les foreign
      long = possibles.reduce((acc, cur) => {
        acc = cur.label ? Math.max(acc, parseInt(cur.label.length/5)) : acc;
        return acc;
      }, 0);
    } else if (possibles.length > 0) {
      //pour les enum/set
      long = possibles.reduce((acc, cur) => {
        //acc = acc + cur.length * 7;
        Math.max(acc,cur.length*7);
        return acc;
      }, 0);
    }
  }
  
  //const [xs,sm,md,lg,xl] = CalculSize(long);

  const formElement = () => {
    switch (contentType) {
      case "int":
        {
          return (
            <TextField
              autoFocus={autoFocus}
              name={id}
              label={label}
              variant="outlined"
              required={required && false}
              error={error || false}
              type="number"
              value={value || ""}
              onChange={onChange}
              disabled={disabled || false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon> {icon || null} </Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {suffixe || ""}
                  </InputAdornment>
                ),
              }}
              onKeyPress={onValidate}
            />
          );
        }

      case "decimal":
        {
          let stp = 1 / Math.pow(10, detail[1]);
          return (
            <TextField
              autoFocus={autoFocus}
              name={id}
              label={label}
              variant="outlined"
              required={required}
              error={error || false}
              type="number"
              value={value || ""}
              onChange={onChange}
              disabled={disabled || false}
              inputProps={{ step: stp }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon> {icon || null} </Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {suffixe || ""}
                  </InputAdornment>
                ),
              }}
              onKeyPress={onValidate}
            />
          );
        }

      case "float":
        {
          return (
            <TextField
              autoFocus={autoFocus}
              name={id}
              label={label}
              variant="outlined"
              required={required}
              error={error || false}
              type="number"
              value={value || ""}
              onChange={onChange}
              disabled={disabled || false}
              inputProps={{ step: 0.001 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon> {icon || null} </Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {suffixe || ""}
                  </InputAdornment>
                ),
              }}
              onKeyPress={onValidate}
            />
          );
        }

      case "color":
        {
          return (
            <label for={id || ""}>
              {" "}
              {`${label || "Couleur"}${required && '*'}`}
              <input
                key={id || null}
                type="color"
                value={value || null}
                onChange={onChange}
                disabled={disabled || false}
              />
            </label>
          );
        }

      /*case "foreigns":
      case "foreign":
        {
          return (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                {" "}
                <Icon>{icon || null}</Icon>{" "}
              </FormLabel>
              <Select
                autoFocus={autoFocus}
                name={id}
                isSearchable
                isClearable
                isDisabled={disabled || false}
                isMulti={contentType === "foreigns"}
                placeholder={label || ""}
                required={required && false}
                onChange={onChange}
                label={label ? label : null}
                options={possibles !== undefined ? possibles : null}
                fullWidth
                //   styles={customStyles}
                value={
                  contentType === "foreigns"
                    ? possibles.filter((p) => {
                        return value.includes(p["value"]);
                      }) || []
                    : possibles.filter((p) => {
                        return p["value"] === value;
                      })[0] || null
                }
                error={error || false}
              />
            </FormControl>
          );
        }
        break;*/
        case "select": {
          return (
            <>
            <InputLabel>{label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: "100%" }}
              {...prop}
            >
              {props.options
                ? props.options.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))
                : detail.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
            </Select>
          </>
        );
      }
      case "foreigns":
      case "foreign":
        { let v = value
          ? contentType === "foreigns"
            ? possibles.filter((p) => {
                return value.includes(p.value);
              })
            : possibles.filter((p) => {
                return p.value === value;
              })[0]
          : undefined
          return (
            <Autocomplete
              id={id}
              multiple={contentType === "foreigns"}
              style={{ width:'100%', minWidth:180 }}
              loadingText="Liste en cours de chargement"
              options={possibles || null}
              //limitTags={5}
              /*classes={{
          //option: classes.option,
          }}*/
              autoHighlight
              getOptionLabel={(option) => option.label}
              renderOption={(option) => (
                <React.Fragment>
                  <Avatar
                    src={option.image || null}
                    alt={option.label}
                    style={{ marginRight: 12 }}
                  />
                  <Typography variant="body1"> {option.label} </Typography>
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  key={`text${label}`}
                  autoFocus
                  name={id}
                  style={{ width: "100%" }}
                  label={`${label}${required ? '*' : ''}`}
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    endAdornment: (
                      <React.Fragment>
                        {!possibles ? (
                          <Typography variant="h6">Chargement...</Typography>
                        ) : (
                          <Icon>check_all</Icon>
                        )}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              defaultValue={ v || (contentType === "foreigns" ? [] : {}) }
              value={v || (contentType === "foreigns" ? [] : {})}
              onChange={(e, v) => {
                onChange(v);
              }}
            />
          );
        }
        break;
      case "enum":
        {
          return (
            <FormControl
              component="fieldset"
              style={{
                border: "2px solid gray",
                padding: "10px",
                position: "none",
                width: "95%",
              }}
            >
              <FormLabel style={{ marginLeft: "15px" }} component="legend">
                {`${label || "Choix"}${required ? '*' : ''}`}
              </FormLabel>
              <RadioGroup
                row={detail.length < 3} /*style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap'}}*/
                autoFocus={autoFocus}
                aria-label={label || null}
                name={id}
                id={id}
                value={value || ""}
                onChange={onChange}
              >
                {detail.map((rad) => {
                  return (
                    <FormControlLabel
                      value={rad}
                      control={<Radio />}
                      label={rad}
                      disabled={disabled || false}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          );
        }

      case "set":
        {
          return (
            <FormControl
              component="fieldset"
              style={{
                border: "2px solid gray",
                padding: "10px",
                position: "none",
              }}
            >
              <FormLabel style={{ marginLeft: "15px" }} component="legend">
                {`${label || "Selection"}${required ? '*' : ''}`}
              </FormLabel>
              <FormGroup>
                {detail.map((chbx) => {
                  return (
                    <FormControlLabel
                      value={chbx}
                      autoFocus={autoFocus}
                      control={
                        <Checkbox
                          name={id}
                          disabled={disabled || false}
                          checked={
                            typeof value === "string"
                              ? value.includes(chbx)
                              : false
                          }
                          onChange={onChange}
                          value={chbx}
                        />
                      }
                      label={chbx}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          );
        }
        
      case "dateP": //dates passées seulement
      case "dateF": //veut dire date futur seulement
      case "date":
        {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
              <KeyboardDatePicker
                label={`${label ? label : null}${required ? '*' : ''}`}
                name={id}
                clearable
                clearLabel="Vider"
                autoOk={true}
                allowKeyboardControl={true}
                showTodayButton={true}
                todayLabel="Maintenant"
                disabled={disabled || false}
                keyboardIcon={
                  icon && icon.length > 0 ? (
                    <Icon> {icon} </Icon>
                  ) : (
                    <Icon> event </Icon>
                  )
                }
                invalidDateMessage="Format invalide !"
                placeholder={new Date().toISOString().split("T")[0]}
                minDate={
                  contentType === "dateF"
                    ? new Date().toISOString().split("T")[0]
                    : new Date("0000-01-01")
                }
                maxDate={
                  contentType === "dateP"
                    ? new Date().toISOString().split("T")[0]
                    : new Date("3333-12-31")
                }
                value={value || null}
                onChange={(date) => {
                  date === null
                    ? onChange(null)
                    : onChange(date.toISOString().split("T")[0]);
                }}
                format="yyyy-MM-dd"
              />
            </MuiPickersUtilsProvider>
          );
        }

      case "time":
        {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
              <KeyboardTimePicker
                ampm={false}
                name={id}
                label={`${label ? label : null}${required ? '*' : ''}`}
                clearable
                clearLabel="Vider"
                invalidDateMessage="Format invalide !"
                showTodayButton={true}
                todayLabel="Maintenant"
                autoOk={true}
                keyboardIcon={
                  icon && icon.length > 0 ? (
                    <Icon> {icon} </Icon>
                  ) : (
                    <Icon> access_time </Icon>
                  )
                }
                disabled={disabled || false}
                placeholder={new Date().toISOString().split("T")[1]}
                //mask="__:__ _M"
                value={value || null}
                onChange={(time) => onChange(time)}
              />
            </MuiPickersUtilsProvider>
          );
        }

      case "datetimeP":
      case "datetimeF":
      case "datetime":
        {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
              <KeyboardDateTimePicker
                ampm={false}
                name={id}
                allowKeyboardControl={false}
                clearable
                clearLabel="Vider"
                invalidDateMessage="Format invalide !"
                showTodayButton={true}
                todayLabel="Maintenant"
                cancelLabel="Annuler"
                label={`${label ? label : null}${required ? '*' : ''}`}
                keyboardIcon={
                  icon && icon.length > 0 ? (
                    <Icon size='medium'> {icon} </Icon>
                  ) : (
                    <Icon size='medium'> event </Icon>
                  )
                }
                placeholder={new Date().toISOString()}
                disabled={disabled || false}
                onError={(e)=>console.log("erreur ",e)}
                disablePast={contentType === "datetimeF"}
                disableFuture={contentType === "datetimeP"}
                //minDate={contentType === "datetimeF" ? new Date().toISOString() : new Date('0000-01-01')}
                //maxDate={contentType === "datetimeP" ? new Date().toISOString() : new Date('3333-12-31')}
                value={value || null}
                onChange={onChange}
                format="yyyy-MM-dd HH:mm:ss"
              />
            </MuiPickersUtilsProvider>
          );
        }

      case "file":
      case "files": {
        let totalSize = 0;
        let files = [];
        let names = [];
        if (value === undefined || value === null || value.length < 1) {
          files = [];
        } else {
          files = document.getElementById(id)
            ? document.getElementById(id).files
            : [];
          if (files.length === 0) {
            files = value.split(",");
          }
          console.log("files = ", files);
          for (let i = 0; i < files.length; i++) {
            if (files[i].size) {
              totalSize += files[i].size;
            } else {
              totalSize = "Inconnue";
            }
            names.push(files[i].name || files[i]);
          }
        }
        return (
          <fragment style={{ display: "flex" }}>
            <Tooltip title={label || "Choix fichier"}>
              <Button
                disabled={disabled || false}
                variant="contained"
                component="label"
                color="secondary"
              >
                <Icon> {icon || "cloud_upload"} </Icon>
                <input
                  type="file"
                  id={id}
                  name={id}
                  multiple={contentType === "files"}
                  onChange={onChange}
                  style={{ display: "none" }}
                />
              </Button>
            </Tooltip>
            <Tooltip title={names.join(" / ")}>
              <Typography variant="h5" color="secondary">
                {`${
                  files.length === 0 ? "aucun" : files.length
                } fichier(s)\n ${parseInt(totalSize / 1024)} Ko`}
              </Typography>
            </Tooltip>
          </fragment>
        );
      }
      case "image":
      case "images":
        let uploadedImages = [];
        let serverImages =
          value === undefined || value === null || value.length < 2
            ? []
            : value.split(",");
        if (value !== undefined && value !== null && value.length > 0) {
          uploadedImages = document.getElementById(id)
            ? document.getElementById(id).files
            : [];
        }
        const avatars = (ui) => {
          let vi = [];
          for (let i = 0; i < ui.length; i++) {
            vi.push(
              <Tooltip
                title={`${ui[i].name}:${parseInt(ui[i].size / 1024)} Ko`}
              >
                <Avatar
                  alt={`Image ajoutée ${i}`}
                  src={URL.createObjectURL(ui[i])}
                />
              </Tooltip>
            );
          }
          return vi;
        };
        return (
          <fragment style={{ display: "flex" }}>
            <Button
              disabled={disabled || false}
              variant="contained"
              component="label"
              color="secondary"
            >
              <Icon> {icon || "image"} </Icon>
              {label || "Choix Image"}
              <input
                type="file"
                accept="image/*"
                id={id}
                name={id}
                multiple={contentType === "images"}
                onChange={(e) => {
                  /*if(contentType==="image"){onRemove(e,serverImages[0])}*/ onChange();
                }}
                style={{ display: "none" }}
              />
            </Button>
            {contentType === "images" ? (
              <Breadcrumbs
                color="primary"
                separator={
                  serverImages.length > 0 && uploadedImages.length > 0
                    ? "  "
                    : ""
                }
              >
                <span
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {serverImages.map((si, i) => {
                    let vi = [];
                    if (si.includes("/")) {
                      vi.push(
                        <Badge
                          component="a"
                          href="/"
                          onClick={(e) => {
                            onRemove(e, si);
                          }}
                          badgeContent="x"
                          color="primary"
                        >
                          <Tooltip title={`${path}${si}`}>
                            <Avatar
                              alt={`Image d'origine ${i}`}
                              src={`${path}${si}`}
                            />
                          </Tooltip>
                        </Badge>
                      );
                    }
                    return vi;
                  })}
                </span>
                <span
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {avatars(uploadedImages)}
                  {/* <Button icon="clear" callback={onRemove(id)} /> */}
                </span>
              </Breadcrumbs>
            ) : uploadedImages.length === 1 ? (
              <span style={{ display: "flex", justifyContent: "space-around" }}>
                {avatars(uploadedImages)}
              </span>
            ) : (
              <Tooltip title={`${value || "Aucune image"}`}>
                {value && value !== null ? (
                  <Avatar
                    alt={`${label} ${value}`}
                    src={value ? `${path}${value}` : uploadedImages[0]}
                  />
                ) : (
                  <span> Aucune image </span>
                )}
              </Tooltip>
            )}
          </fragment>
        );

      case "geo":
        return (
          <PickupLocation
            name={id}
            label={`${label ? label : "Localisation"}${required && '*'}`}
            zoom={defaultZoom}
            /*center={JSON.parse(value)}*/ onDblClick={onChange}
          />
        );

      case "address":
        return (
          <AutoCompAddress
            id={id}
            name={id}
            defaultValue={value}
            label={`${label ? label : "Adresse"}${required && '*'}`}
            onChange={onChange}
            zoom={12}
            displayMap={false}
          />
        );

      case "text":
          return (<FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" style={{display:'flex',flexWrap:'no-wrap',justifyContent:'start'}}>
              {/*<Icon style={{marginRight:10}}>{icon || null}</Icon>*/}
              <Typography variant="body2">{ value && value.length > 0 && label }</Typography>
            </FormLabel>
            <TextareaAutosize
              name={id}
              required={required && false}
              rowsMin={detail[1] || 1}
              style={{ width: "90%" }}
              aria-label="maximum height"
              placeholder={error || label}
              value={value}
              onChange={onChange}
              autoFocus={autoFocus}
              onKeyPress={onValidate}
            />
          </FormControl>
          );

      case "signature":
        return (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 200,
              }}
            >
              <Icon>{icon || "border_color"}</Icon>{" "}
              <Typography variant="subtitle2">{`${label || null}${required ? '*' : ''}`}</Typography>
              {value && <Avatar alt="Pas d'image" src={value} />}
              <Tooltip title="Effacer">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    sign.current.clear();
                    onChange({ value: null });
                  }}
                >
                  <Icon>autorenew</Icon>
                </Button>
              </Tooltip>
            </div>
            <div
              style={{
                width: document.body.clientWidth > 450 ? 460 : 360,
                height: document.body.clientHeight > 450 ? 460 : 360,
                border: "1px solid gray",
                padding: 1,
              }}
            >
              <SignaturePad
                //penColor='green'
                onEnd={(e) =>
                  onChange({
                    value: sign.current
                      .getTrimmedCanvas()
                      .toDataURL("image/png"),
                  })
                }
                ref={sign}
                canvasProps={{width: document.body.clientWidth > 450 ? 460 : 360, height: document.body.clientHeight > 450 ? 460 : 360}}
              />
            </div>
          </div>
        );

      case "slider":
        return (
          <div style={{ width: "100%" }}>
            <Typography id={"-slider-" + id}>{label}</Typography>
            <Slider
              min={typeAndLength(type)[0] || prop.min || 0}
              aria-label={label}
              aria-valuetext={value}
              value={value}
              onChangeCommitted={onChange}
              max={typeAndLength(type)[1] || prop.max || value}
              //range={prop.range}
            />
          </div>
          );
      
      default: {
        var FormattedInput;
        if(inputProps && inputProps['format']){
          console.log("prop.format")
          FormattedInput = ({ inputRef, ...other })=>{
            return (
              <MaskedInput
                /*{...other}*/
                ref={(ref) => {
                  inputRef(ref ? ref.inputElement : null);
                }}
                mask={inputProps.format}
                placeholderChar={'\u2000'}
                showMask
              />
            );
          }
        }
        else{ FormattedInput = 'input' }
        //let inputComp = prop['format'] ? (<FormattedInput mask={prop.format} showMask={true}/>) : 'input'
        return (
          <TextField
            {...prop}
            name={id}
            inputRef={sign}
            label={label}
            variant="outlined"
            required={required && false}
            error={error || false}
            autoFocus={autoFocus}
            value={value || ""}
            onChange={onChange}
            type={contentType}
            disabled={disabled || false}
            placeholder={error || ""}
            multiline={contentType === "text"}
            fullWidth
            onKeyPress={onValidate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon> {icon || null} </Icon>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">{suffixe || ""}</InputAdornment>
              ),
              inputComponent: FormattedInput
            }}
          />
        );
      }
    }
  };

  return filtre ? (
    <Grid id={`Grid${id}`} style={{ margin: 12, width: "100%" }} item>
      {formElement()}
      <Typography color="error" variant="body2">{error}</Typography>
    </Grid>
  ) : (
    <Grid
      id={`Grid${id}`}
      style={{display:'flex',minWidth:160}}
      item
      {...CalculSize(long)}
    >
      {formElement()}
     {error && (<Typography color="error" variant="body2">{error}</Typography>) }
      { complement }
    </Grid>
  );
};
Inputs.defaultProps = {
  possibles: [],
  complement: null
};
export default Inputs;
