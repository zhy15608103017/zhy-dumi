export class Spin {
    constructor(text = '文件生成中', document) {
        this.promptText = text;
        this.document = document ?? window.document;
    }
    start() {
        this.end()
        this.firstel = document.createElement('div');
        this.firstel.innerHTML = `
        <div class="fore-spin fore-spin-lg fore-spin-spinning">
         <span class="fore-spin-dot fore-spin-dot-spin">
        <i class="fore-spin-dot-item"></i>
        <i class="fore-spin-dot-item"></i>
        <i class="fore-spin-dot-item"></i>
        <i class="fore-spin-dot-item"></i>
    </span>
    <div class="fore-spin-text">${this.promptText} <div class="fore-loading-dots">
    <span class="fore-dot">.</span>
    <span class="fore-dot">.</span>
    <span class="fore-dot">.</span>
  </div></div>
   </div>   
        `
        this.firstel.className = 'fore-end-export-disgraceful';
       this.document.body.append(this.firstel)
    }
     end(){
        if(this.firstel){
           this.document.body.removeChild(this.firstel)
        }
        this.firstel=null
     }
}