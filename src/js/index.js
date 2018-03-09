class Subject { 
  constructor(id, type, subjectName, lectionCount, labCount, isCourseProject) {
    this.id = id;
    this.type = type;
    this.subjectName = subjectName;
    this.lectionCount = lectionCount;
    this.labCount = labCount;
    this.isCourseProject = isCourseProject;
  }

    set setLectionCount(lectionCount)
    {
      if (lectionCount<0)
          throw "Lection count can't be above zero";
      this.lectionCount = lectionCount;
    }

      get getLectionCount()
      {
          return this.lectionCount;
      }

      set setIsCourseProject(isCourseProject)
      {
          this.isCourseProject = isCourseProject;
      }

      get getIsCourseProject()
      {
          if(this.isCourseProject == "on") return true
          else return false;
      }

      set setLabCount(labCount)
      {
          if (labCount<0)
              throw "Lab count can't be above zero"
          this.labCount = labCount;
      }

      get getLabCount()
      {
          return this.labCount;
      }

     set setSubjectName(subjectName)
      {
          this.subjectName = subjectName;
      }

      get getSubjectName()
      {
          return this.subjectName;
      }
    }

class Economics extends Subject { 
  constructor(id, type, subjectName, lectionCount, labCount, isCourseProject, controlType, listenersCount) {

    super(id, type, subjectName, lectionCount, labCount, isCourseProject);

    this.controlType = controlType;
    this.listenersCount = listenersCount;
 }
}


class Chemistry extends Subject {
   constructor(id, type, subjectName, lectionCount, labCount, isCourseProject, lector, faculty){
    super(id, type, subjectName, lectionCount, labCount, isCourseProject);

    this.lector = lector;
    this.faculty = faculty;
 }
}


////////////////////////HTMLHelper////////////////////////////////////

class HtmlHelper {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }  

  get(url, query) {    
    let fullUrl = this.baseUrl + url + (query ? query : "");    
    return this.request(fullUrl, 'GET', null);
  }

  post(url, body) {    
    let fullUrl = this.baseUrl + url;
    return this.request(fullUrl, 'POST', body);
  }

  put(url, id, body) {    
    let fullUrl = this.baseUrl + url + '/' + id;
    return this.request(fullUrl, 'PUT', body);    
  }

  delete(url, id) {    
    let fullUrl = this.baseUrl + url + "/" + id;
    return this.request(fullUrl, 'DELETE', null);
  }

  request(url, method, body) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        if(xhr.readyState != 4) return;

        if(xhr.status == 200 || xhr.status == 201) {
          return resolve(JSON.parse(xhr.responseText));          
        } else {
          return reject(new Error(xhr.responseText));
        }
      }
      xhr.send(body);
    });
  }
}

  /////////////////////////////Parse////////////////////////////////////////

  this.subjects = [];

  function parseJsonToSubject(element)
  {
      let subject = {};
      if (element.type == 'Economics') 
      {
          subject = new Economics(element.id, element.type, element.subjectName, element.lectionCount, element.labCount, element.isCourseProject, element.controlType, element.listenersCount);
      } 
      else if(element.type == 'Chemistry') 
      {
          subject = new Chemistry(element.id, element.type, element.subjectName, element.lectionCount, element.labCount, element.isCourseProject, element.lector, element.faculty);
      }
      else if(element.type == 'Subject') 
      {
          subject = new Subject(element.id, element.type, element.subjectName, element.lectionCount, element.labCount, element.isCourseProject);
      }
      
      subject.setLectionCount = element.lectionCount;
      subject.setLabCount = element.labCount;
      subject.setSubjectName = element.subjectName;
      return subject;
  }


  function getQueryParam(param) {
    var result =  window.location.search.match(
        new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
    );
    return result ? result[3] : false;
  }

  function createTable(data) 
  {
    subjects = [];
    for (let item in data) {
      if (data.hasOwnProperty(item)) {
        let subject = parseJsonToSubject(data[item]);
        subjects.push(subject);
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", subject.id);
        tr.onclick = function() {
          document.location = "info.html?id=" + this.getAttribute("data-id");
        }
        tr.id = "Subject" + subject.id;
        let values = [subject.id, subject.type, subject.subjectName, subject.lectionCount, subject.labCount,subject.isCourseProject,];
        for (let i = 0; i < values.length; i++) {
          let td = document.createElement("td");
          let text = document.createTextNode(values[i]);
          td.appendChild(text);
          tr.appendChild(td);
        }
        let td = document.createElement("td");
        let editLink = document.createElement("a");
        editLink.href = 'edit.html?id=' + subject.id;
        let text = document.createTextNode("Edit ");
        editLink.appendChild(text);      
        td.appendChild(editLink); 
        let deleteLink = document.createElement("a");
        deleteLink.setAttribute("data-id", subject.id);
        let textDelete = document.createTextNode(" Delete");      
        deleteLink.onclick = function(ev) {
          let result = confirm("Are you sure?")
          if(result)
            deleteSubject(this.getAttribute("data-id"));
          ev.preventDefault();
          ev.stopPropagation();
        }
        deleteLink.href = '#';
        deleteLink.appendChild(textDelete);
        td.appendChild(deleteLink);
        tr.appendChild(td);
  
        document.getElementById("subject-table-body").appendChild(tr);
      }
    }
  }
  
  function getJsonSubjectFromField() {
    document.getElementById("form-subject");
    let subject = {};
    let subjectType = document.getElementById("type").value;  
    let data = {
      type: subjectType,
      subjectName: document.getElementById("subjectName").value,
      lectionCount: document.getElementById("lectionCount").value,
      labCount: document.getElementById("labCount").value,
      isCourseProject: document.getElementById("isCourseProject").value
    };
    switch (subjectType) {
      case "Economics":
        subject = new Economics(0, 
          data.type,
          data.subjectName,
          data.lectionCount,
          data.labCount,
          data.isCourseProject,
          document.getElementById("controlType").value,
          document.getElementById("listenersCount").value);
        break;
      case "Chemistry":
        subject = new Chemistry(0, 
          data.type,
          data.subjectName,
          data.lectionCount,
          data.labCount,
          data.isCourseProject,
          document.getElementById("lector").value,
          document.getElementById("faculty").value);
        break;
      case "Subject":
        subject = new Subject(0, 
          data.type,
          data.subjectName,
          data.lectionCount,
          data.labCount,
          data.isCourseProject);
        break;  
    }

    subject.setLectionCount = data.lectionCount;
    subject.setLabCount = data.labCount;
    subject.setSubjectName = data.subjectName;
    return JSON.stringify(subject);
  }

  function postSubject() 
  {  
    const subject = getJsonSubjectFromField();
    if(subject !== undefined) {
      const htmlHelper = new HtmlHelper();
      htmlHelper.post('/subjects', subject)
        .then(() => {
          alert("Success");
          document.location = 'create.html';
        })
        .catch(ex => { alert("Error"); console.log(ex) });
    }
  }

  function putSubject() {  
    const subject = getJsonSubjectFromField();
    if(subject !== undefined) {
      const htmlHelper = new HtmlHelper();
      let url = new URL(document.location.href);
      let id = url.searchParams.get("id");
      htmlHelper.put("/subjects", id, subject)
        .then(() => alert("Success"))
        .catch(ex => { alert("Error"); console.log(ex) });
    }
  }

  function deleteSubject(id) {
    const htmlHelper = new HtmlHelper();  
    htmlHelper.delete("/subjects", id)
      .then(() => {
        document.getElementById("Subject"+id).remove();      
        const subjectID = subjects.indexOf(findSubjectById(id));
        subjects.splice(subjectID, 1);            
        alert("Success");    
      })
      .catch(ex => { alert("Error"); console.log(ex) });
  }

  function loadInfoCurrentSubject() {
    const htmlHelper = new HtmlHelper();  
    const id = getQueryParam('id');
    htmlHelper.get(`/subjects/${id}`)
      .then(data => fillInfoFields(data))
      .catch(ex => { alert("Error"); console.log(ex) });
  }

  function fillInfoFields(data) {
    const subject = parseJsonToSubject(data);
    if(subject instanceof Economics) {
      document.getElementById("controlType").innerText = subject.controlType;
      document.getElementById("listenersCount").innerText = subject.listenersCount;
    } else if (subject instanceof Chemistry) {
      document.getElementById("lector").innerText = subject.lector;
      document.getElementById("faculty").innerText = subject.faculty;
    }
    // type, subjectName, lectionCount, labCount, isCourseProject
    document.getElementById("type").innerText = subject.type;
    changePages(subject.type);
    document.getElementById("subjectName").innerText = subject.subjectName;
    document.getElementById("lectionCount").innerText = subject.lectionCount;
    document.getElementById("labCount").innerText = subject.labCount;
    document.getElementById("isCourseProject").innerText = subject.isCourseProject;
  }

  function loadCurrentSubject() {
    const htmlHelper = new HtmlHelper();  
    const id = getQueryParam('id');
    htmlHelper.get(`/subjects/${id}`)
      .then(data => fillFormFields(data))
      .catch(() => alert("Error"));
  }

  function fillFormFields(data) 
  {
    const subject = parseJsonToSubject(data);
    if(subject instanceof Economics) {
      document.getElementById("controlType").value = subject.controlType;
      document.getElementById("listenersCount").value = subject.listenersCount;
    } 
    else if (subject instanceof Chemistry) {
      document.getElementById("lector").value = subject.lector;
      document.getElementById("faculty").value = subject.faculty;
    }
    // type, subjectName, lectionCount, labCount, isCourseProject
    document.getElementById("type").value = subject.type;
    changePages(subject.type);
    document.getElementById("subjectName").value = subject.subjectName;
    document.getElementById("lectionCount").value = subject.lectionCount;
    document.getElementById("labCount").value = subject.labCount;
    document.getElementById("isCourseProject").value = subject.isCourseProject;
  }

  function changePages(type) {  
    switch (type) {
      case "Subject":
        document.getElementById("chemistry-fields").hidden = true;
        document.getElementById("economics-fields").hidden = true;
        break;
      case "Chemistry": 
        document.getElementById("chemistry-fields").hidden = false;
        document.getElementById("economics-fields").hidden = true;
        break;
      case "Economics": 
        document.getElementById("chemistry-fields").hidden = true;
        document.getElementById("economics-fields").hidden = false;
        break;
      default: 
        break;
    }
  }

  function goToIndex() {
    document.location = "index.html";
  }
  
  function loadIndexPage() {
    const htmlHelper = new HtmlHelper();
    htmlHelper.get('/subjects')
      .then(data => createTable(data))
      .catch(() => alert("Error"));
  }

  this.subjectGenerator = function* () 
  {
    for(let subject of subjects) {
      yield subject;
    }
  };


  function findSubjectById(id) 
  {
    const gen = subjectGenerator();
    let item = gen.next();
    while(!item.done) {
      if(item.value.id === id) {
        return item.value;
      }
      item = gen.next();
    }
  }

  function searchSubjects() {
    const query = document.getElementById('searchSubjects').value || '';  
    const gen = subjectGenerator();
    let item = gen.next();
    while(!item.done) {
      if(item.value.subjectName.includes(query) || item.value.lectionCount.toString().includes(query) || 
        item.value.type.includes(query) || query == '') {
          document.getElementById(`Subject${item.value.id}`).hidden = false;
      } else {
        document.getElementById(`Subject${item.value.id}`).hidden = true;      
      }
      item = gen.next();
    }
  }

  function setValidation() {
    document.getElementById("subjectName").addEventListener("invalid", function() {showErrorMessage("subjectName-error", false);});
    document.getElementById("lectionCount").addEventListener("invalid", function() {showErrorMessage("lectionCount-error", false);});
    document.getElementById("labCount").addEventListener("invalid", function() {showErrorMessage("labCount-error", false);});
  }
  
  function showErrorMessage(idElement, isHidden, message) {
    document.getElementById(idElement).hidden = isHidden;
    if(message != undefined)
    {
      document.getElementById(idElement).innerText = message;
    }
  }
  
  function hideErrorMessages()
  {
    let idElementErrors = ["subjectName-error", "lectionCount-error", "labCount-error"];
    idElementErrors.forEach(function (elem) {
      showErrorMessage(elem, true);
    })
  }