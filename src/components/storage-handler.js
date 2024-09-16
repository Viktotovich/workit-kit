import * as taskMaster from "./task-master";

const storageManager = {
  saveProjects: function () {
    const jsonObj = JSON.stringify(taskMaster.projects);
    localStorage.setItem("savedProjects", jsonObj);
  },
  loadProjects: function () {
    if (!localStorage.getItem("savedProjects")) {
      this.saveProjects();
    } else {
      const localObj = localStorage.getItem("savedProjects");
      const parsedObj = JSON.parse(localObj);

      Object.keys(taskMaster.projects).forEach(
        (key) => delete taskMaster.projects[key]
      );
      Object.assign(taskMaster.projects, parsedObj);
    }
  },
  clearLocalStorage: function () {
    localStorage.clear();
    taskMaster.workCatReset.resetWorkCat();

    const deepProjectInstance = {};
    //basically, this is because Javascript is Javascript. We are doing this to prevent having 8 tasks, as not using parse and stringify would mean that we are storing a reference to the properties and we end up with x2 the properties. This way however, the object goes through so much that it basically has nothing to do with the original workCat anymore
    deepProjectInstance[taskMaster.workCat.catTitle] = JSON.parse(
      JSON.stringify(taskMaster.workCat)
    );
    console.log(deepProjectInstance);

    Object.keys(taskMaster.projects).forEach(
      (key) => delete taskMaster.projects[key]
    );
    Object.assign(taskMaster.projects, deepProjectInstance);
  },
};

export { storageManager };
