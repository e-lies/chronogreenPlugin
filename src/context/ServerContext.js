import React from "react";
import {
  path,
  schemaNbHours,
  schemaNbTry,
  selectNbMinutes,
  writeCachMinutes
} from "./Params";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Modal from "@material-ui/core/Modal";

const loginPage = "/rfid";

export const CrudContext = React.createContext({
  getSchema: (type, rule) => {},
  schemas: { select: {}, insert: {}, update: {}, delete: {} },
  data: {},
  loadRead: [],
  loadWrite: [],
  uData: {},
  updateData: () => {},
  read: (queries = []) => {},
  write: (pst, callback) => {},
  writeCache: { insert: [], update: [], delete: [], inserts: [] },
  unmountRule: (type, key) => {},
  componentCreation: id => {}
});

export default class ServerContext extends React.Component {
  state = {
    lastId: 0,
    //uData:{},
    popData: { insert: {}, update: {}, delete: {} },
    schemaAttempts: {},
    schemas: localStorage.getItem("schemas") ? JSON.parse(localStorage.getItem("schemas")) : { select: {}, insert: {}, update: {}, delete: {} },
    data: {},
    writeCache: localStorage.getItem("writeCache") ? JSON.parse(localStorage.getItem("writeCache")) : { insert: [], update: [], delete: [], inserts: [] },
    components: {}, // identifiant:componentType
    loadRead: [],
    loadWrite: []
  };
  
  componentWillUnmount() {
    const { data, writeCache } = this.state;
    let tm = new Date().getTime();
    localStorage.setItem("schemas",JSON.stringify(this.state.schemas))
    localStorage.setItem("writeCache",JSON.stringify(this.state.writeCache))
    /*let lsr = JSON.parse(localStorage.getItem("reads") || "[]") || {};
    let lsw = JSON.parse(localStorage.getItem("writes") || "[]") || {}; 
    Object.keys(data).map(parm1 => {
      if (data[parm1]["expire"] > tm && lsr) {
        lsr[parm1] = data[parm1]["data"];
      }
    });
    Object.keys(writeCache).map(parm2 => {
      if (writeCache[parm2]["expire"] > tm && lsw) {
        lsw[parm2] = writeCache[parm2]["data"];
      }
    });
    localStorage.setItem("reads", lsr);
    localStorage.setItem("writes", lsw);*/
  }

  componentCreation = type => {
    let li = this.state.lastId + 1;
    this.setState(state => {
      let c = { ...state.components, [`${type}-${li}`]: type };
      return { lastId: state.lastId + 1, components: c };
    });
    return `${type}-${li}`;
  };
  destroyComponent = id => {
    let { components, data, loadRead, loadWrite } = this.state;
    components = Object.keys(components).filter(cmpId => {
      return cmpId !== id;
    });
    Object.keys(data).map(rule => {
      data = Object.keys(data[rule]).filter(d => {
        return data[rule][d]["idComp"] !== id;
      });
      Object.keys(data).length > 0 && delete data[rule];
    });
    loadRead = loadRead.filter(cmp => {
      return cmp !== id;
    });
    this.setState({ components, loadRead, data });
    loadWrite = loadRead.filter(cmp => {
      return cmp !== id;
    });
    this.setState({ components, loadWrite, data });
  };
  loadComp = (idComp, type) => {
    if (type === "read") {
      this.setState(state => {
        return { loadRead: [...state.loadRead, idComp] };
      });
    } else if (type === "write") {
      this.setState(state => {
        return { loadWrite: [...state.loadWrite, idComp] };
      });
    }
  };
  unloadComp = idComp => {
    this.setState(state => {
      return {
        loadRead: state.loadRead.filter(comp => {
          return comp !== idComp;
        }),
        loadWrite: state.loadWrite.filter(comp => {
          return comp !== idComp;
        })
      };
    });
  };
  getSchema = (type, rule, idComp = "", force = false) => {
    let tm = new Date().getTime();
    if (
      this.state.schemas[type][rule] &&
      this.state.schemas[type][rule]["expire"] > tm &&
      !force
    ) {
      return false;
    } else {
      let obj = this;
      //this.loadComp(idComp);
      //let status;
      fetch(path + "/Models/Rules/Schema.php?type=" + type + "&rule=" + rule)
        .then(function(prm) {
          if ((prm.status === 500 || prm.status === 404) && schemaNbTry > 0) {
            //on réessaie un certain nombre de fois avant d'arréter
            let attempts = obj.state.schemaAttempts;
            if (
              attempts[`${type}_${rule}`] &&
              attempts[`${type}_${rule}`]["nbAttempts"] < schemaNbTry
            ) {
              attempts[`${type}_${rule}`]["nbAttempts"]++;
              setTimeout(
                obj.setState(
                  { schemaAttempts: attempts },
                  obj.getSchema(type, rule)
                ),
                parseInt(selectNbMinutes * 60000)
              );
              console.log(`problème ${prm.status} lors du chargement du schéma ! \n
					 une nouvelle tentative aura lieu dans ${selectNbMinutes} minutes pour ${type}_${rule}`);
            } else if (
              attempts[`${type}_${rule}`] &&
              attempts[`${type}_${rule}`]["nbAttempts"] >= schemaNbTry
            ) {
              delete attempts[`${type}_${rule}`];
              obj.setState(
                { schemaAttempts: attempts },
                console.log(
                  `Fin des tentatives pour le schméma ${type}_${rule} !`
                )
              );
            } else {
              let confRetry = window.confirm(`Erreur ${prm.status} lors du chargement du schéma ! \n
					 souhaitez vous une nouvelle tentative dans ${selectNbMinutes} minutes pour ${type}_${rule}`);
              if (confRetry) {
                // si le user souhaite qu'il y'ait d'autres tentatives
                attempts[`${type}_${rule}`] = 1;
                setTimeout(
                  obj.setState(
                    { schemaAttempts: attempts },
                    obj.getSchema(type, rule)
                  ),
                  parseInt(selectNbMinutes * 60000)
                );
              }
            }
          } else if (prm.status === 401) {
            console.log("Vous n’êtes pas autorisé à effectuer cette action !");
          } else if (prm.status === 408) {
            console.log("Temps dépassé \n Votre réseau semble trop lent !");
          } else if (prm.status > 299) {
            prm.text().then(rep => {
              alert(prm.status + " " + rep);
            });
          } //si erreur non définie ou nbr de tentatives dépassées
          else {
            prm.json().then(function(rep) {
              let schemas = { ...obj.state.schemas };
              schemas[type] =
                typeof schemas[type] === "object" ? schemas[type] : {};
              schemas[type][rule] = { ...rep };
              schemas[type][rule]["expire"] = parseInt(
                tm + 3600000 * schemaNbHours
              );
              //schemas[type][rule]['columns'] = rep['columns'];
              schemas[type][rule]["idComp"] = idComp;
              obj.setState({ schemas }, obj.unloadComp(idComp, "read"));
            });
          }
          obj.unloadComp(idComp);
        })
        .catch(function(rep) {
          obj.unloadComp(idComp);
          console.log("Le problème " + rep + " a empéché l'accès au serveur !");
          let confRetry = window.confirm("Souaitez-vous réessayer ?");
          confRetry && obj.getSchema(type, rule);
        });
    }
  };
  
  populate = (type, rule, where, idComp = "", force = false) => {
    console.log("populate = ", type, rule, where);
    let tm = new Date().getTime();
    if (
      this.state.popData[rule] !== undefined &&
      this.state.popData[rule][JSON.stringify(where).replace(/"/gi, "")] !==
        undefined &&
      this.state.popData[rule][JSON.stringify(where).replace(/"/gi, "")][
        "expire"
      ] < tm &&
      !force
    ) {
      return false;
    } else {
      let obj = this;
      obj.loadComp(idComp, "read");
      fetch(
        path +
          "/Models/Rules/PopulateData.php?type=" +
          type +
          "&rule=" +
          rule +
          "&where=" +
          JSON.stringify(where)
      ).then(prm => {
        if (prm.status === 401) {
          alert("Demande non autorisée !");
        } else if (prm.status === 408) {
          alert(
            "La récupération des données prend trop de temps\n Votre réseau semble trop lent !"
          );
        } else if (prm.status !== 200) {
          alert(prm.text());
        } else {
          prm.json().then(rep => {
            let { popData } = obj.state;
            popData[type][rule] = popData[type][rule] || {};
            let wh =
              where.length > 0
                ? JSON.stringify(where).replace(/"/gi, "")
                : "all";
            let exp = obj.state.schemas[type][rule]
              ? obj.state.schemas[type][rule]["expire"]
              : 0; //cas où le schema n'est pas pret
            popData[type][rule][wh] = { data: rep, expire: exp, idComp };
            obj.setState({ popData }, obj.unloadComp(idComp));
          });
        }
      });
    }
  }

  read = (quer, idComp = "", force = false,callback=null) => { //Attention! S'il y a plusieurs requetes, callback s'éxécutera sur le résultat de chacune
    let tm = new Date().getTime();
    let { data } = this.state;
    let queries = [...quer]; //pour ne pas modifier query chez l'emmeteur
    queries.map((q, i) => {
      //éliminer les requetes dont les données existent
      let parm =
        q.params && Object.keys(q.params).length > 0
          ? JSON.stringify(q.params)
          : "all";
      if (
        data[q.rule] &&
        data[q.rule][parm] &&
        data[q.rule][parm]["expire"] > tm &&
        !force
      ) {
        queries.splice(i,1);
        if(callback){ callback(data[q.rule][parm]['data'],q.rule,parm) }
      }
    });
    if (queries.length > 0) {
      let query = JSON.stringify(queries);
      let obj = this;
      this.loadComp(idComp, "read");
      fetch(path + "/Models/Rules/Read.php?queries=" + query)
        .then(function(prm) {
          if (prm.status === 500) {
            //on réessaie un certain nombre de fois avant d'arréter
            let confRetry = window.confirm(
              "Données non chargées ! Souaitez-vous réessayer ?"
            );
            confRetry && setTimeout(obj.read(queries), 1000);
          } else if (prm.status === 404) {
            alert("Introuvable !\n votre requête est peut-être mal structurée");
          } else if (prm.status === 401) {
            let conf = window.confirm("Vous n’êtes pas autorisé à accéder à ces données ! \n Souhaitez-vous vous reconnecter ?");
            if(conf){ window.location.replace(loginPage) }
          } else if (prm.status === 408) {
            alert("Temps dépassé \n Votre réseau semble trop lent !");
          } else if (prm.status > 299) {
            alert(prm.text());
            return;
          } //si erreur non définie ou nbr de tentatives dépassées
          else {
            prm.json().then(function(rep) {
              console.log("Données récupérées",rep)
              let data = { ...obj.state.data };
              let warnings = [];
              Object.keys(rep).map(ru => {
                data[ru] = data[ru] || {};
                Object.keys(rep[ru]).map(param => {
                  data[ru][param] = new Object();
                  data[ru][param]["data"] = rep[ru][param]["data"];
                  if(callback){ callback(rep[ru][param]["data"],ru,param) }
                  data[ru][param]["idComp"] = idComp;
                  data[ru][param]["expire"] = obj.state.schemas.select[ru]
                    ? obj.state.schemas.select[ru]["expire"] || 0
                    : 0;
                  warnings.push(rep[ru][param]["warnings"]);
                });
              });
              console.log("Avertissements: " + warnings.join("\n"));
              obj.setState({ data }, console.log("Données récupérées",data));
            });
          }
          obj.unloadComp(idComp);
        })
        .catch(function(rep) {
          obj.unloadComp(idComp);
          console.log("Le problème " + rep + " a empéché l'accès au serveur !");
          let confRetry = window.confirm(
            "Données non chargées ! Souaitez-vous réessayer ?"
          );
          confRetry && setTimeout(obj.read(queries), 1000);
        });
    }
  }

  write = (pst, callback, idComp = "") => {
    let obj = this;
    let tm = new Date().getTime();
    if (Array.isArray(pst)) {
      let fd = new FormData()
      fd.set('q',JSON.stringify(pst))
      pst = fd
      /*pst = "q=" + JSON.stringify(pst);
      header["Content-Type"] = "application/x-www-form-urlencoded";*/
    }
    pst.set('idComp',idComp)
    obj.loadComp(idComp, "write");
    const reqs = JSON.parse(pst.get("q"));
    let writeCache = { ...obj.state.writeCache };
    let drop;
    // Regles qui existent deja sur writeCache qui vont etre modifiees
    const common = writeCache[reqs[0].type].filter(
      (x, index, array) => array.filter(y => y.rule === x.rule).length
    );
    // Verifier si l'utilisateur veut remplacer les requetes precedentes ou simplement ajouter celles-ci
    
    let header = { "Access-Control-Allow-Methods": "POST" };
    fetch(path + "/Models/Rules/Write.php", {
      method: "POST",
      mode: "cors",
      headers: header,
      body: pst
    })
      .then(prm => {
        /**
         * If it's a server error, change the cache's state to pending
         * If it's a success, remove it from cache
         */
        /*if (prm.status > 299) {
          writeCache[reqs[0].type] = writeCache[reqs[0].type].reduce(
            (acc, curr, index, array) =>
              array.filter(el =>
                array.map(e => e.request.rule).includes(curr.request.rule)
              )
                ? [...acc, { ...curr, uploading: false }]
                : [...acc, curr],
            []
          );
          obj.setState({ writeCache });
        }*/
        if (prm.status === 500 || prm.status === 404) {
          //on réessaie un certain nombre de fois avant d'arréter
          console.log("Erreur " + prm.status);
          let st = prm.status;
          prm.text().then(rep=> callback(rep,st))
          let confRetry = window.confirm(
            " Requêtes non éxecutées! Souaitez-vous réessayer ?"
          );
          confRetry && setTimeout(obj.write(pst, callback), 1000);
        } else if (prm.status === 401) {
          alert("Vous n’êtes pas autorisé à effectuer cette opération !");
        } else if (prm.status === 408) {
          alert("Temps dépassé \n Votre réseau semble trop lent !");
          callback("Trop long",prm.status)
        } else if (prm.status > 299) {
          prm.text().then(rep => { console.log(rep); callback(rep,prm.status) });
        } //si erreur non définie ou nbr de tentatives dépassées
        else {
          let st = prm.status;
          prm.json().then(rep => {
            writeCache[reqs[0].type] = writeCache[reqs[0].type].filter(
              req => req.request.rule !== reqs[0].rule
            );
            obj.setState({ writeCache }, callback(rep, st));
          });
        }
        obj.unloadComp(idComp);
      })
      .catch(function(rep) {
        obj.unloadComp(idComp);
        console.log("Le problème " + rep + " a empéché l'accès au serveur !");
        let confRetry = window.confirm(
          " Requêtes non éxecutées! Souaitez-vous réessayer ?"
        );
        confRetry && setTimeout(obj.write(pst, callback), 1000);
      });
  };

  render() {
    return (
      <CrudContext.Provider
        value={{
          loadRead: this.state.loadRead,
          loadWrite: this.state.loadWrite,
          schemas: this.state.schemas,
          getSchema: this.getSchema,
          popData: this.state.popData,
          populate: this.populate,
          data: this.state.data,
          read: this.read,
          write: this.write,
          componentCreation: this.componentCreation,
          destroyComponent: this.destroyComponent,
          writeCache: this.state.writeCache
        }}
      >
        {this.props.children}
        <Modal
          open={this.state.loadWrite.length > 0}
          style={{ color: "#fff" }}
          onClick={e => {
            let conf = window.confirm(
              "Vous ne souhaitez pas attendre la confirmation de l'opération ?"
            );
            if (conf) {
              this.setState({ loadWrite: [] });
            }
          }}
        >
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <CircularProgress size={360} color="secondary" />
          </div>
        </Modal>
      </CrudContext.Provider>
    );
  }
}
