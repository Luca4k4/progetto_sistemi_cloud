<template>

  <div class="container-fluid p-0 d-inline-block">
    <nav class="navbar navbar-expand-lg py-1" style="background-color: lightyellow; border-bottom: 1px solid rosybrown">
      <img src="../assets/logo.png" class="img-fluid" style="height: 70px; margin-right:5px">
      <a class="navbar-brand" href="/"><span style="font-size: 80%; font-weight: bold; display: block">Progetto di Sistemi Cloud (L. Pappagallo)</span><span style="font-size: 60%; font-weight: normal;">Prof: G. Pappalardo, A. F. Fornaia</span></a>
    </nav>

    <div class="card m-4 text-center bg-white">
      <div class="card-body">
        <b>TheSmilingChat</b>
        <br>
        <span class="badge text-bg-success">Successi: {{numeroRichiesteSuccessoAlServer}}</span>
        <span class="badge text-bg-danger" style="margin-left: 3px">Errori da sovraccarico: {{numeroErroriDalServer}}</span>
        <hr>
        <div class="mt-2">
          <span><i>Se è attivo il <b>Docker Swarm Visualizer</b>, sarà possibile raggiungerlo cliccando <a target="_blank" :href="dockerSwarmVisualizerUrl">qui</a></i></span>
          <br>
          <span class="badge text-bg-danger mt-2" style="margin-left: 3px">Crash del backend: {{numeroCrashDalServer}}</span>
        </div>
        <hr>

        <br>
        <div class="row d-flex justify-content-between">
          <div class="col">
            <div class="input-group">
              <span class="input-group-text">Conversazioni simulate</span>
              <button class="btn btn-outline-secondary" type="button" :disabled="isRunning" @click="numConversazioniSimulate+2 > 2 ? numConversazioniSimulate-=2 : numConversazioniSimulate = 0">-</button>
              <input v-model="numConversazioniSimulate" type="text" class="form-control" :readonly="true">
              <button class="btn btn-outline-secondary" type="button" :disabled="isRunning" @click="numConversazioniSimulate+2 < 30 ? numConversazioniSimulate+=2 : numConversazioniSimulate = 30">+</button>
            </div>
          </div>
          <div class="col-2">
            <button type="button" class="btn btn-outline-primary" style="width: 100%;" @click="avvia()">Avvia {{ numConversazioniSimulate }} Conversazioni</button>
          </div>
          <div class="col-1" style="padding-right: 0px; padding-left: 0px">
            <button type="button" class="btn btn-outline-danger" style="width: 100%;" @click="stop()">Interrompi</button>
          </div>
          <div class="col-2">
            <button type="button" class="btn btn-danger" style="width: 100%;" @click="eseguiRichiestaCrash()">Crash Backend</button>
          </div>
        </div>
      </div>
    </div>

    <!-- d-flex justify-content-center -->
    <div class="row px-3"> 
      <!-- col-md-8 col-lg-6 col-xl-4 -->
      <div class="col-md-3 px-2 mb-3" v-for="(conversazione, idx) in conversazioni" :key="idx">
        <div v-if="conversazione.messaggi.length > 0" class="card" style="font-size: 95%">
          <div class="card-header d-flex justify-content-between align-items-center p-3"
            style="border-top: 4px solid #ffa900;">
            <h6 class="mb-0">Messaggi</h6>
            <div class="d-flex flex-row align-items-center">
              <span class="badge bg-warning">{{ conversazione.messaggi.length }}</span>
            </div>
          </div>
          <div class="card-body overflow-y-auto" data-mdb-perfect-scrollbar="true" style="position: relative; height: 400px">

            <div v-for="(messaggio, idxMessaggio) in conversazione.messaggi" :key="idxMessaggio">
              <div v-if="idxMessaggio % 2 == 0">
                <div class="d-flex justify-content-between">
                  <p class="small mb-1">{{ messaggio.utente }}</p>
                  <p class="small mb-1 text-muted">{{ messaggio.data_ora }}</p>
                </div>
                <div class="d-flex flex-row justify-content-start">
                  <img :src="getIconaByNome(messaggio.utente)"
                    alt="avatar 1" style="width: 45px; height: 100%;">
                  <div>
                    <p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">
                      <span v-html="messaggio.testo"></span>
                    </p>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="d-flex justify-content-between">
                  <p class="small mb-1 text-muted">{{ messaggio.data_ora }}</p>
                  <p class="small mb-1">{{ messaggio.utente }}</p>
                </div>
                <div class="d-flex flex-row justify-content-end mb-4 pt-1">
                  <div>
                    <p class="small p-2 me-3 mb-3 text-white rounded-3" style="background-color: wheat">
                      <span v-html="messaggio.testo"></span>
                    </p>
                  </div>
                  <img :src="getIconaByNome(messaggio.utente)" style="width: 45px; height: 100%;">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      numConversazioniSimulate: 0,
      conversazioni: [], // Array di oggetti: {chat_id: .., [{utente: ..., messaggio: ..., data_ora: ...}]}
      utenti: [],
      myInterval: null,
      numeroRichiesteSuccessoAlServer: 0,
      numeroErroriDalServer: 0,
      numeroCrashDalServer: 0,

      isRunning: false,

      probabilitaCrash: 0,

      refreshErrorCounter: 0, // Quando riceve un errore, aspetta x "volte" prima di riprendere a inviare richieste
      dockerSwarmVisualizerUrl: "",
    };
  },
  methods: {
    getUtenti(){
      axios.get('/backend/get_utenti')
      .then((response) => {
        this.utenti = response.data
        console.log(this.utenti.length)
      })
      .catch((errore) => {
        console.error(errore);
      });
    },
    getIconaByNome(nome){
      for(const idx in this.utenti){
        if(this.utenti[idx].nome == nome){
          return this.utenti[idx].icona;
        }
      }
    },
    avvia(){
      // Reimposto le conversazioni
      this.isRunning = true

      this.conversazioni = []
      for(let i = 0; i < this.numConversazioniSimulate; i++){
        this.conversazioni.push({chat_idx: i, messaggi: []})
      }
      clearInterval(this.myInterval)

      this.numeroRichiesteSuccessoAlServer = 0
      this.numeroErroriDalServer = 0

      // Inserisco i messaggi
      this.myInterval = setInterval(()=>{
        for(const idx in this.conversazioni){
          let lunghezzaAttualeMessaggi = this.conversazioni[idx].messaggi.length

          axios.get('/backend/esegui_operazione?nome_utente='+this.utenti[idx*2].nome+'&probabilita_crash='+this.probabilitaCrash)
            .then((response) => {
              if('data' in response && 'nome_utente' in response.data){
                this.conversazioni[idx].messaggi.push({
                  utente: response.data.nome_utente,
                  testo: response.data.frase,
                  data_ora: "26/09/2023"
                })
                this.numeroRichiesteSuccessoAlServer++
              } else {
                this.numeroErroriDalServer++
              }
            })
            .catch((errore) => {
              this.numeroErroriDalServer++
            });

          axios.get('/backend/esegui_operazione?nome_utente='+this.utenti[idx*2 + 1].nome+'&probabilita_crash='+this.probabilitaCrash)
            .then((response) => {
              if('data' in response && 'nome_utente' in response.data){
                this.conversazioni[idx].messaggi.push({
                  utente: response.data.nome_utente,
                  testo: response.data.frase,
                  data_ora: "26/09/2023"
                })
                this.numeroRichiesteSuccessoAlServer++
              } else {
                this.numeroErroriDalServer++
              }
            })
            .catch((errore) => {
              this.numeroErroriDalServer++
            });
        }
      }, 400)
    },
    stop(){
      clearInterval(this.myInterval)
      this.conversazioni = []
      this.isRunning = false
    },
    eseguiRichiestaCrash(){
      this.numeroCrashDalServer++;

      axios.get('/backend/crash')
            .then((response) => {
              console.log("Risposta di avvenuto crash ricevuta")
            })
            .catch((errore) => {
              console.log("Risposta di avvenuto crash NON ricevuta")
            });
    }
  },
  created(){
    this.getUtenti()
  },
  mounted(){
    this.dockerSwarmVisualizerUrl = (window.location.href.split(":8")[0]) + ":8080"
  },
  computed: {
    conversazioniSimulateArr: function(){
      let arr = []
      for(let i=0; i<this.numConversazioniSimulate; i++){
        arr.push(i)
      }
      return arr
    },
  }
};
</script>