function Subject(id, type, subjectName, lectionCount, labCount, isCourseProject)
{
    this.id = id;
    this.type = type;
    this.subjectName = subjectName;
    this.lectionCount = lectionCount;
    this.labCount = labCount;
    this.isCourseProject = isCourseProject;

    this.setLectionCount = function(lectionCount)
    {
      if (lectionCount<0)
          throw "Lection count can't be above zero";
      this.lectionCount = lectionCount;
    }

      this.getLectionCount = function()
      {
          return this.lectionCount;
      }

      this.setIsCourseProject = function(isCourseProject)
      {
          this.isCourseProject = isCourseProject;
      }

      this.getIsCourseProject = function()
      {
          if(this.isCourseProject == "on") return true
          else return false;
      }

      this.setLabCount = function(labCount)
      {
          if (labCount<0)
              throw "Lab count can't be above zero"
          this.labCount = labCount;
      }

      this.getLabCount = function()
      {
          return this.labCount;
      }

      this.setSubjectName = function(subjectName)
      {
          this.subjectName = subjectName;
      }

      this.getSubjectName = function()
      {
          return this.subjectName;
      }
}

function Economics(id, type, subjectName, lectionCount, labCount, isCourseProject, controlType, listenersCount)
{
    Subject.call(this, id, type, subjectName, lectionCount, labCount, isCourseProject);

    this.controlType = controlType;
    this.listenersCount = listenersCount;
}

Economics.prototype = Object.create(Subject.prototype);


function Chemistry(id, type, subjectName, lectionCount, labCount, isCourseProject, lector, faculty)
{
    Subject.call(this, id, type, subjectName, lectionCount, labCount, isCourseProject);

    this.lector = lector;
    this.faculty = faculty;
}

Chemistry.prototype = Object.create(Subject.prototype);

////////////////////////HTMLHelper////////////////////////////////////

function HtmlHelper()
{
    this.baseUrl = 'http://localhost:3000';
}

HtmlHelper.prototype.get = function (url, query, successClb, failedClb) {
  var xhr = new XMLHttpRequest();
  var fullUrl = this.baseUrl + url;
  xhr.open('GET', fullUrl);
  xhr.onreadystatechange = function() {
    if(xhr.readyState != 4) return;

    if(xhr.status == 200) {
      successClb(JSON.parse(xhr.responseText));
    } else {
      failedClb();
    }
  }
  xhr.send();
}
  
  HtmlHelper.prototype.post = function(url, body, successClb, faliedClb) {
    var xhr = new XMLHttpRequest();
    var fullUrl = this.baseUrl + url;
    xhr.open('POST', fullUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if(xhr.readyState != 4) return;
  
      if(xhr.status == 201) {
        successClb();
      } else {
        faliedClb();
      }
    }
    xhr.send(body);
  }
  
  HtmlHelper.prototype.put = function(url, id, body, successClb, faliedClb) {
    var xhr = new XMLHttpRequest();
    var fullUrl = this.baseUrl + url + '/' + id;
    xhr.open('PUT', fullUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if(xhr.readyState != 4) return;
  
      if(xhr.status == 200) {
        successClb();
      } else {
        faliedClb();
      }
    }
    xhr.send(body);
  }
  
  HtmlHelper.prototype.delete = function(url, id, successClb, faliedClb) {
    var xhr = new XMLHttpRequest();
    var fullUrl = this.baseUrl + url + "/" + id;
    xhr.open('DELETE', fullUrl);
    xhr.onreadystatechange = function() {
      if(xhr.readyState != 4) return;
  
      if(xhr.status == 200) {
        successClb();
      } else {
        faliedClb();
      }
    }
    xhr.send();
  }


  /////////////////////////////Parse////////////////////////////////////////

  function parseJsonToSubject(element)
  {
      var subject = {};
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
      
      subject.setIsCourseProject(element.isCourseProject);
      subject.setLectionCount(element.lectionCount);
      subject.setLabCount(element.labCount);
      subject.setSubjectName(element.subjectName);
      return subject;
  }

  function createTable(data) 
  {
    for (var item in data) {
      if (data.hasOwnProperty(item)) {
        var subject = parseJsonToSubject(data[item]);
        var tr = document.createElement("tr");
        tr.setAttribute("data-id", subject.id);
        tr.onclick = function() {
          document.location = "info.html?id=" + this.getAttribute("data-id");
        }
        tr.id = "Subject" + subject.id;
        var values = [subject.id, subject.type, subject.subjectName, subject.lectionCount, subject.labCount,subject.isCourseProject,];
        for (var i = 0; i < values.length; i++) {
          var td = document.createElement("td");
          var text = document.createTextNode(values[i]);
          td.appendChild(text);
          tr.appendChild(td);
        }
        var td = document.createElement("td");
        var editLink = document.createElement("a");
        editLink.href = 'edit.html?id=' + subject.id;
        var text = document.createTextNode("Edit ");
        editLink.appendChild(text);      
        td.appendChild(editLink); 
        var deleteLink = document.createElement("a");
        deleteLink.setAttribute("data-id", subject.id);
        var textDelete = document.createTextNode(" Delete");      
        deleteLink.onclick = function(ev) {
          var result = confirm("Are you sure?")
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
    var subject = {};
    var subjectType = document.getElementById("type").value;  
    var data = {
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
    subject.setIsCourseProject(data.isCourseProject);
    subject.setLectionCount(data.lectionCount);
    subject.setLabCount(data.labCount);
    subject.setSubjectName(data.subjectName);
    return JSON.stringify(subject);
  }

  function postSubject() 
  {  
    var subject = getJsonSubjectFromField();
    var htmlHelper = new HtmlHelper();
    htmlHelper.post("/subjects", subject, function() {
      alert("Success");
      document.location = "create.html";
    }, function() {alert("Error");});  
  }

  function putSubject() {  
    var subject = getJsonSubjectFromField();
    var htmlHelper = new HtmlHelper();
    var url = new URL(document.location.href);
    var id = url.searchParams.get("id");
    htmlHelper.put("/subjects", id, subject, function() {alert("Success");}, function() {alert("Error");});
  }

  function deleteSubject(id) {
    var htmlHelper = new HtmlHelper();
    htmlHelper.delete("/subjects", id, function() {
      document.getElementById("Subject"+id).remove();
      alert("Success");    
    }, function() {alert("Error");});  
  }

  function loadInfoCurrentSubject() {
    var htmlHelper = new HtmlHelper();
    var url = new URL(document.location.href);
    var id = url.searchParams.get("id");
    htmlHelper.get("/subjects/"+id, "", fillInfoFields, function() {alert("Error");});
  }

  function fillInfoFields(data) {
    var subject = parseJsonToSubject(data);
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
    var htmlHelper = new HtmlHelper();
    var url = new URL(document.location.href);
    var id = url.searchParams.get("id");
    htmlHelper.get("/subjects/"+id, "", fillFormFields, function() {alert("Error");});
  }

  function fillFormFields(data) 
  {
    var subject = parseJsonToSubject(data);
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
    var htmlHelper = new HtmlHelper();
    htmlHelper.get('/subjects', "", createTable, null);
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
    var idElementErrors = ["subjectName-error", "lectionCount-error", "labCount-error"];
    idElementErrors.forEach(function (elem) {
      showErrorMessage(elem, true);
    })
  }