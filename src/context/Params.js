export const path = "/chronogreen";//"http://127.0.0.1:8080/siraj"; //"http://130.211.108.62"  //"http://numental.fr/Mtek";
export const limitSession = 120; //nombres maximum d'appel au sessions serveur sans réponse
export var schemaNbHours = 24;
export var selectNbMinutes = 10;
export const schemaNbTry = 5;
export const writeCachMinutes = 240;
export const googleMapsKey = "AIzaSyALHD-Zhi1-so3qvf5yyKwcYuQdGLQZRRE";
export const defaultLocation = { lat: 48.8645373001102, lng: 2.32148343492213 };
export const defaultZoom = 14;
export const defaultRadius = 100000; //rayon de recherche maps en mètre
/*export const headerImage = "http://127.0.0.1:8080/Mtek2020/header.png";
export const footerImage = "http://127.0.0.1:8080/Mtek2020/footer.png";*/
export const treeOfLife = [
  {
    id: "vendeur",
    label: "Vendeur",
    icon: "",
    description: "Contenus réservés aux vendeurs mobile",
    cond: (session) => session.role === "vendeur",
    children: [
      {
        id: "Accueil",
        icon: "home",
      },
      {
        id:"Approvisionnements",
        icon:"swap_vert",
        description:"Les mouvements",
        children:[
          {
            id:"Besoins",
            icon:"shopping_cart",
            description:"Liste de mes demandes non validées"
          },
          {
            id:"Demandes",
            icon:".....",
            description:"Les préparations dirigées à mon magasin ou sans magasin"
          },{
            id:"Validation",
            label: "A valider",
            icon: "check_all",
            description:"Regrouper par mouvement, puis par demande_mouvement, puis par aes, avec possibilité d'inventaire"
          },{
            id:"Historique",
            icon:"history",
            description:"Regrouper par mouvement, puis par demande_mouvement, puis par aes, et possibilité d'impression"
          }
        ]
      },
      {
        id: "Articles",
        icon: "category",
        description: "Gestion de vos articles et leurs entrées",
        children: [
          {
            id: "Entrées",
            icon: "input",
            description: "Liste de vos approvisionnements que vous pouvez accepter ou refuser"
          },
          {
            id: "EnAttente",
            label: "Appros demandées",
            icon: "alarm",
            description: "Liste de vos demandes d'approvisionnement en attente"
          },
          {
            id: "Aes",
            label: "Articles en stock",
            icon: "list",
            description: "Liste de vos articles actuellement en stock"
          },
          {
            id: "Inventaire",
            icon: "find_in_page",
            description: "Rechercher vos articles en stock"
          },
          {
            id: "Historique",
            label: "Historique des entrées",
            icon: "history",
            description: "Historique de tous les articles avec lesquels vous avez été approvisionné"
          }
        ]
      },
      {
        id: "Ventes",
        icon: "shopping_cart",
        description: "Gestion des nouvelles et anciennes ventes",
        children: [
          {
            id: "Commande",
            label: "Nouvelle vente",
            icon: "add_shopping_cart",
            description:
              "Créer une nouvelle vente ou continuer une précédente",
          },
          {
            id: "Virtuelle",
            label: "Dématerialisée",
            icon: "cloud",
            description: "Vente sans passer pas le magasins"
          },
          {
            id:"Historique",
            icon: "history",
            description: "Historique de vos ventes précédentes"
          }
        ]
      },
      {
        id: "Finance",
        icon: "money",
        description: "Gestion de vos dépenses et vos rentrées d'argent",
        children: [
          {
            id: "Opérations",
            icon: "swap_horiz",
            description: "Liste de vos clients avec possibilité de faire des versements ou des encaissements avec chacun d'entre eux"
          },
          {
            id: "Historique",
            label: "Historique",
            icon: "history",
            description: "Historique de toutes les opérations avec vos clients"
          }
        ]
      }
    ]  
  }
];
export const notifRules = {
  Prescripteur: [
    {
      group: ["Délais", "Couleur"],
      rule: "InterventionPrescripteur",
      params: {
        cols: [
          { col: "id" },
          { col: "Intervention" },
          { col: "Délais" },
          { col: "Couleur" },
          { col: "Client" },
        ],
        where: [
          { label: "Etat", operator: "<>", value: "Cloturée" },
          { label: "Etat", operator: "<>", value: "Annulée" },
        ],
      },
    },
  ],
  Dispatcheur: [],
  Technicien: [],
  Chef: [],
};