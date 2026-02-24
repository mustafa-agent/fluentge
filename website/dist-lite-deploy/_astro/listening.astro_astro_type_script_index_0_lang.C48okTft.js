let i=[],l=null,g=JSON.parse(localStorage.getItem("listening-scores")||"{}"),p=JSON.parse(localStorage.getItem("listening-completed")||"[]");const x={A1:"bg-green-500",A2:"bg-blue-500",B1:"bg-yellow-500",B2:"bg-orange-500",C1:"bg-red-500"};fetch("/data/listening_exercises.json").then(e=>e.json()).then(e=>{i=e,m(),E()}).catch(e=>{console.error("Error loading exercises:",e),document.getElementById("exercise-list").innerHTML='<div class="col-span-full text-center text-[#6B6B65] py-8">ვარჯიშების ჩატვირთვაში შეცდომა</div>'});function m(e="all"){const n=document.getElementById("exercise-list"),s=e==="all"?i:i.filter(t=>t.level===e);n.innerHTML=s.map(t=>{const c=p.includes(t.id),o=g[t.id],u=o?`${Math.round(o.correct/o.total*100)}%`:"";return`
          <div class="exercise-card relative" onclick="startExercise(${t.id})">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs px-2 py-1 rounded-full ${x[t.level]} text-white">${t.level}</span>
              ${c?'<span class="text-xs text-green-500">✓ დასრულებული</span>':""}
            </div>
            <h3 class="font-semibold mb-2">ვარჯიში ${t.id}</h3>
            <p class="text-sm text-[#6B6B65] mb-3 line-clamp-2">${t.text.slice(0,80)}...</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-[#6B6B65]">${t.questions.length} კითხვა</span>
              ${u?`<span class="text-xs font-semibold text-green-500">${u}</span>`:""}
            </div>
          </div>
        `}).join("")}function y(e){if(l=i.find(s=>s.id===e),!l)return;document.getElementById("exercise-list").style.display="none",document.getElementById("exercise-player").classList.remove("hidden"),document.getElementById("exercise-level").textContent=l.level,document.getElementById("exercise-number").textContent=`ვარჯიში ${l.id}`;const n=document.getElementById("audio-player");n.src=`/audio/listening/exercise_${String(l.id).padStart(2,"0")}.mp3`,v(),B()}function v(){const e=document.getElementById("questions");e.innerHTML=l.questions.map((n,s)=>`
        <div class="question mb-6">
          <h4 class="font-semibold mb-3">${s+1}. ${n.q}</h4>
          <div class="grid gap-2">
            ${n.opts.map((t,c)=>`
              <button class="question-option" onclick="selectAnswer(${s}, ${c})">
                ${String.fromCharCode(65+c)}. ${t}
              </button>
            `).join("")}
          </div>
        </div>
      `).join("")}function E(){const e=p.length;if(document.getElementById("completed-count").textContent=e,e>0){const n=Object.values(g).reduce((c,o)=>c+o.correct/o.total*100,0),s=Math.round(n/e);document.getElementById("average-score").textContent=`${s}%`;let t="A1";s>=90&&e>=15?t="C1":s>=80&&e>=10?t="B2":s>=70&&e>=8?t="B1":s>=60&&e>=5&&(t="A2"),document.getElementById("level-badge").textContent=t}}function B(){const e=document.getElementById("prev-exercise"),n=document.getElementById("next-exercise"),s=i.findIndex(t=>t.id===l.id);e.style.display=s>0?"block":"none",n.textContent=s<i.length-1?"შემდეგი ვარჯიში":"სიაზე დაბრუნება"}const d=document.getElementById("audio-player"),f=document.getElementById("play-pause-btn"),r=document.getElementById("play-icon"),a=document.getElementById("pause-icon"),I=document.getElementById("replay-btn"),h=document.getElementById("audio-progress"),$=document.getElementById("audio-time");f.addEventListener("click",()=>{d.paused?(d.play(),r.classList.add("hidden"),a.classList.remove("hidden")):(d.pause(),r.classList.remove("hidden"),a.classList.add("hidden"))});I.addEventListener("click",()=>{d.currentTime=0,d.play(),r.classList.add("hidden"),a.classList.remove("hidden")});d.addEventListener("timeupdate",()=>{if(d.duration){const e=d.currentTime/d.duration*100;h.style.width=`${e}%`;const n=Math.floor(d.currentTime/60),s=Math.floor(d.currentTime%60),t=Math.floor(d.duration/60),c=Math.floor(d.duration%60);$.textContent=`${n}:${s.toString().padStart(2,"0")} / ${t}:${c.toString().padStart(2,"0")}`}});d.addEventListener("ended",()=>{r.classList.remove("hidden"),a.classList.add("hidden")});document.getElementById("back-to-list").addEventListener("click",()=>{document.getElementById("exercise-list").style.display="grid",document.getElementById("exercise-player").classList.add("hidden"),m()});document.getElementById("prev-exercise").addEventListener("click",()=>{const e=i.findIndex(n=>n.id===l.id);e>0&&y(i[e-1].id)});document.getElementById("next-exercise").addEventListener("click",()=>{const e=i.findIndex(n=>n.id===l.id);e<i.length-1?y(i[e+1].id):document.getElementById("back-to-list").click()});document.querySelectorAll(".level-filter").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".level-filter").forEach(n=>n.classList.remove("active")),e.classList.add("active"),m(e.dataset.level)})});
