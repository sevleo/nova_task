import { format, parseISO } from "date-fns";
import { ProjectModule } from "./ProjectModule";
import { TaskModule } from "./TaskModule";
import {
  saveTaskToLocalStorage,
  deleteTaskFromLocalStorage,
} from "./LocalStorageModule";

export { DOMModule };

// DOM module
const DOMModule = (function () {
  function createMainDiv() {
    const body = document.querySelector("body");
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("main");
    body.append(mainDiv);

    // Light/Dark mode switcher
    const html = document.querySelector("html");
    html.classList.add("dark-mode");
    const modeToggleButton = document.createElement("div");
    modeToggleButton.setAttribute("id", "toggle-mode-button");
    modeToggleButton.classList.add("dark");
    mainDiv.append(modeToggleButton);

    const modeToggleIcon = document.createElement("span");
    modeToggleIcon.classList.add("material-symbols-outlined");
    modeToggleIcon.innerHTML = "dark_mode";
    modeToggleButton.append(modeToggleIcon);

    modeToggleButton.addEventListener("click", () => {
      if (modeToggleButton.classList.contains("light")) {
        modeToggleButton.classList.remove("light");
        modeToggleButton.classList.add("dark");
        modeToggleIcon.innerHTML = "dark_mode";
        html.classList.remove("light-mode");
        html.classList.add("dark-mode");
      } else {
        modeToggleButton.classList.remove("dark");
        modeToggleButton.classList.add("light");
        modeToggleIcon.innerHTML = "light_mode";
        html.classList.remove("dark-mode");
        html.classList.add("light-mode");
      }
    });
  }

  const createDialogs = (function () {
    const body = document.querySelector("body");
    // newProjectDialogHandler();
    // newTaskDialogHandler();

    function createTaskDeleteDialog() {
      const taskDeleteDialog = document.createElement("dialog");
      taskDeleteDialog.classList.add("task-delete", "hidden");

      const deleteConfirmForm = document.createElement("form");
      taskDeleteDialog.append(deleteConfirmForm);

      const deleteConfirmText = document.createElement("div");
      deleteConfirmText.classList.add("confirm-text");
      deleteConfirmText.textContent =
        "Are you sure you want to delete this task?";
      deleteConfirmForm.append(deleteConfirmText);

      const deleteConfirmButton = document.createElement("button");
      deleteConfirmButton.setAttribute("type", "submit");
      deleteConfirmButton.textContent = "Confirm";
      deleteConfirmForm.append(deleteConfirmButton);

      const deleteCancelButton = document.createElement("button");
      deleteCancelButton.setAttribute("type", "close");
      deleteCancelButton.textContent = "Cancel";
      deleteConfirmForm.append(deleteCancelButton);

      body.append(taskDeleteDialog);
    }

    function createProjectDeleteDialog() {
      const projectDeleteDialog = document.createElement("dialog");
      projectDeleteDialog.classList.add("project-delete", "hidden");

      const deleteConfirmForm = document.createElement("form");
      projectDeleteDialog.append(deleteConfirmForm);

      const deleteConfirmText = document.createElement("div");
      deleteConfirmText.classList.add("confirm-text");
      deleteConfirmText.textContent =
        "Are you sure you want to delete the project? All tasks that belong to this project will be deleted too.";
      deleteConfirmForm.append(deleteConfirmText);

      const deleteConfirmButton = document.createElement("button");
      deleteConfirmButton.setAttribute("type", "submit");
      deleteConfirmButton.textContent = "Confirm";
      deleteConfirmForm.append(deleteConfirmButton);

      const deleteCancelButton = document.createElement("button");
      deleteCancelButton.setAttribute("type", "close");
      deleteCancelButton.textContent = "Cancel";
      deleteConfirmForm.append(deleteCancelButton);

      body.append(projectDeleteDialog);
    }

    function newProjectDialogHandler() {
      const newProjectDialog = createProjectDialog();
      const newProjectDialogForm = createProjectDialogForm();

      function createProjectDialog() {
        const newProjectDialog = document.createElement("dialog");
        newProjectDialog.classList.add("new-project", "hidden");
        body.append(newProjectDialog);
        return newProjectDialog;
      }

      function createProjectDialogForm() {
        const newProjectDialogForm = document.createElement("form");
        newProjectDialog.append(newProjectDialogForm);
        newProjectDialogForm.addEventListener("submit", () => {
          const projectName = document.querySelector(
            "dialog.new-project > form input#project-name",
          );
          const projectColor = document.querySelector(
            "dialog.new-project > form input#project-color",
          );
          ProjectModule.createProject(projectName.value, projectColor.value);
          DOMModule.createLeftDiv.createProjects(
            ProjectModule.getProjectObjects(),
          );
          DOMModule.createDialogs.newTaskDialogHandler();
        });

        const dialogName = document.createElement("div");
        dialogName.classList.add("project-dialog-name");
        dialogName.textContent = "New Project";
        newProjectDialogForm.append(dialogName);

        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");
        newProjectDialogForm.append(inputContainer);

        const nameFieldDiv = document.createElement("div");
        nameFieldDiv.classList.add("project-name-field-div");
        inputContainer.append(nameFieldDiv);

        const nameFieldLabel = document.createElement("label");
        nameFieldLabel.textContent = "Name*";
        nameFieldLabel.setAttribute("for", "project-name");
        nameFieldDiv.append(nameFieldLabel);

        const nameFieldInput = document.createElement("input");
        nameFieldInput.textContent = "Name";
        nameFieldInput.setAttribute("type", "text");
        nameFieldInput.setAttribute("id", "project-name");
        nameFieldInput.setAttribute("placeholder", "Awesome project...");
        nameFieldInput.setAttribute("required", "required");
        nameFieldDiv.append(nameFieldInput);

        const colorFieldDiv = document.createElement("div");
        colorFieldDiv.classList.add("project-color-field-div");
        inputContainer.append(colorFieldDiv);

        const colorFieldLabel = document.createElement("label");
        colorFieldLabel.textContent = "Color";
        colorFieldLabel.setAttribute("for", "project-color");
        colorFieldDiv.append(colorFieldLabel);

        const colorFieldInput = document.createElement("input");
        colorFieldInput.textContent = "Color";
        colorFieldInput.setAttribute("type", "color");
        colorFieldInput.setAttribute("id", "project-color");
        colorFieldDiv.append(colorFieldInput);

        const submitProjectButton = document.createElement("button");
        submitProjectButton.setAttribute("type", "submit");
        submitProjectButton.textContent = "Save";
        newProjectDialogForm.append(submitProjectButton);

        const closeProjectDialogDiv = document.createElement("div");
        closeProjectDialogDiv.classList.add("close-project-dialog");
        newProjectDialogForm.append(closeProjectDialogDiv);

        const closeProjectDialogSpan = document.createElement("span");
        closeProjectDialogSpan.classList.add("material-symbols-outlined");
        closeProjectDialogSpan.textContent = "close";
        closeProjectDialogDiv.append(closeProjectDialogSpan);

        // Add close animation on Save and Close
        handleCloseAnimation(
          newProjectDialogForm,
          newProjectDialog,
          "submit",
          newProjectDialogForm,
        );
        handleCloseAnimation(
          closeProjectDialogSpan,
          newProjectDialog,
          "click",
          newProjectDialogForm,
        );

        return newProjectDialogForm;
      }
    }

    function newTaskDialogHandler() {
      const existingTaskDialog = document.querySelector(".new-task");
      if (existingTaskDialog) {
        existingTaskDialog.remove();
      }

      const newTaskDialog = createTaskDialog();
      const newTaskDialogForm = createTaskDialogForm();

      function createTaskDialog() {
        const newTaskDialog = document.createElement("dialog");
        newTaskDialog.classList.add("new-task", "hidden");
        body.append(newTaskDialog);
        return newTaskDialog;
      }

      function createTaskDialogForm() {
        const existingTaskDialogForm =
          document.querySelector(".new-task > form");
        if (existingTaskDialogForm) {
          existingTaskDialogForm.remove();
        }
        const newTaskDialogForm = document.createElement("form");
        newTaskDialog.append(newTaskDialogForm);
        newTaskDialogForm.addEventListener("submit", () => {
          const taskProject = document.querySelector(
            "dialog.new-task > form #task-project",
          );
          const taskTitle = document.querySelector(
            "dialog.new-task > form #task-title",
          );
          const taskNotes = document.querySelector(
            "dialog.new-task > form #task-notes",
          );
          // const taskPriority = document.querySelector('dialog.new-task > form #task-priority');
          const taskDate = document.querySelector(
            "dialog.new-task > form #task-date",
          );
          TaskModule.createTask(
            taskProject.value,
            taskTitle.value,
            taskNotes.value,
            taskDate.value,
          );

          DOMModule.createRightDiv.createTasks(
            TaskModule.getProjectTasks(
              TaskModule.getActiveProject(),
              TaskModule.getTasksFromActiveView(),
            ),
          );
        });

        const dialogName = document.createElement("div");
        dialogName.classList.add("task-dialog-name");
        dialogName.textContent = "New Task";
        newTaskDialogForm.append(dialogName);

        const today = new Date();
        const formatteDate = today.toISOString().split("T")[0];

        const newTaskDialogFieldsTemplate = [
          {
            element_type: "select",
            div_class: "task-project-field-div",
            element_id: "task-project",
            input_type: "text",
            label: "Project",
            textContent: "Project",
            select_options: ProjectModule.getProjectValues(),
            cursor_style: "pointer",
          },
          {
            element_type: "input",
            div_class: "task-title-field-div",
            element_id: "task-title",
            input_type: "text",
            label: "Title *",
            textContent: "Title",
            text_placeholder: "Read a book",
            required: "required",
          },
          {
            element_type: "textarea",
            div_class: "task-notes-field-div",
            element_id: "task-notes",
            input_type: "",
            label: "Notes",
            textContent: "",
            text_placeholder: "At least a page",
          },
          // {
          //     element_type: 'select',
          //     div_class: 'task-priority-field-div',
          //     element_id: 'task-priority',
          //     input_type: '',
          //     label: 'Priority',
          //     textContent: 'Priority',
          //     select_options: ['High', 'Normal', 'Low'],
          //     select_default: 'Normal',
          //     cursor_style: 'pointer',
          // },
          {
            element_type: "input",
            div_class: "task-date-field-div",
            element_id: "task-date",
            input_type: "date",
            label: "Date *",
            textContent: "Date",
            required: "required",
            value: formatteDate,
          },
        ];

        newTaskDialogFieldsTemplate.forEach((element) => {
          const fieldDiv = document.createElement("div");
          fieldDiv.classList.add(element.div_class);
          newTaskDialogForm.append(fieldDiv);

          const fieldLabel = document.createElement("label");
          fieldLabel.textContent = element.label;
          fieldLabel.setAttribute("for", element.element_id);
          fieldDiv.append(fieldLabel);

          const fieldInput = document.createElement(element.element_type);
          fieldInput.textContent = element.textContent;
          fieldInput.setAttribute("type", element.input_type);
          fieldInput.setAttribute("id", element.element_id);
          fieldInput.setAttribute("placeholder", element.text_placeholder);
          fieldInput.setAttribute(element.required, element.required);
          if (element.value) {
            fieldInput.value = element.value;
          }
          fieldInput.style.cursor = element.cursor_style;
          fieldDiv.append(fieldInput);

          if (element.element_type === "select") {
            element.select_options.forEach((item) => {
              const option = document.createElement("option");
              option.setAttribute("value", item);
              option.textContent = item;
              fieldInput.append(option);
              if (item === element.select_default) {
                option.setAttribute("selected", "");
              }
            });
          }
        });

        const submitTaskButton = document.createElement("button");
        submitTaskButton.setAttribute("type", "submit");
        submitTaskButton.textContent = "Save";
        newTaskDialogForm.append(submitTaskButton);

        const closeTaskDialogDiv = document.createElement("div");
        closeTaskDialogDiv.classList.add("close-task-dialog");
        newTaskDialogForm.append(closeTaskDialogDiv);

        const closeTaskDialogSpan = document.createElement("span");
        closeTaskDialogSpan.classList.add("material-symbols-outlined");
        closeTaskDialogSpan.textContent = "close";
        closeTaskDialogDiv.append(closeTaskDialogSpan);

        // Add close animation on Save and Close
        handleCloseAnimation(
          newTaskDialogForm,
          newTaskDialog,
          "submit",
          newTaskDialogForm,
        );
        handleCloseAnimation(
          closeTaskDialogSpan,
          newTaskDialog,
          "click",
          newTaskDialogForm,
        );
      }
    }

    function editTaskDialogHandler(taskId) {
      const existingTaskDialog = document.querySelector(".edit-task");
      if (existingTaskDialog) {
        existingTaskDialog.remove();
      }

      const editTaskDialog = createEditTaskDialog();
      const editTaskDialogForm = createEditTaskDialogForm();

      function createEditTaskDialog() {
        const newTaskDialog = document.createElement("dialog");
        newTaskDialog.classList.add("edit-task", "hidden");
        body.append(newTaskDialog);
        return newTaskDialog;
      }

      function createEditTaskDialogForm() {
        const existingTaskDialogForm =
          document.querySelector(".edit-task > form");
        if (existingTaskDialogForm) {
          existingTaskDialogForm.remove();
        }
        const editTaskDialogForm = document.createElement("form");
        editTaskDialog.append(editTaskDialogForm);

        editTaskDialogForm.addEventListener("submit", () => {
          const taskProject = document.querySelector(
            "dialog.edit-task > form #task-project",
          );
          const taskTitle = document.querySelector(
            "dialog.edit-task > form #task-title",
          );
          const taskNotes = document.querySelector(
            "dialog.edit-task > form #task-notes",
          );
          // const taskPriority = document.querySelector('dialog.new-task > form #task-priority');
          const taskDate = document.querySelector(
            "dialog.edit-task > form #task-date",
          );
          TaskModule.updateTask(
            taskProject.value,
            taskTitle.value,
            taskNotes.value,
            taskDate.value,
            taskId,
          );

          DOMModule.createRightDiv.createTasks(
            TaskModule.getProjectTasks(
              TaskModule.getActiveProject(),
              TaskModule.getTasksFromActiveView(),
            ),
          );
        });

        const dialogName = document.createElement("div");
        dialogName.classList.add("task-dialog-name");
        dialogName.textContent = "Edit Task";
        editTaskDialogForm.append(dialogName);

        const taskObject = TaskModule.findObjectById(taskId);

        const newTaskDialogFieldsTemplate = [
          {
            element_type: "select",
            div_class: "task-project-field-div",
            element_id: "task-project",
            input_type: "text",
            label: "Project",
            textContent: "Project",
            select_options: ProjectModule.getProjectValues(),
            cursor_style: "pointer",
            value: "Math",
          },
          {
            element_type: "input",
            div_class: "task-title-field-div",
            element_id: "task-title",
            input_type: "text",
            label: "Title *",
            textContent: "Title",
            text_placeholder: "Read a book",
            required: "required",
            value: taskObject.title,
          },
          {
            element_type: "textarea",
            div_class: "task-notes-field-div",
            element_id: "task-notes",
            input_type: "",
            label: "Notes",
            textContent: "",
            text_placeholder: "At least a page",
            value: taskObject.notes,
          },
          {
            element_type: "input",
            div_class: "task-date-field-div",
            element_id: "task-date",
            input_type: "date",
            label: "Date *",
            textContent: "Date",
            required: "required",
            value: taskObject.date,
          },
        ];

        newTaskDialogFieldsTemplate.forEach((element) => {
          const fieldDiv = document.createElement("div");
          fieldDiv.classList.add(element.div_class);
          editTaskDialogForm.append(fieldDiv);

          const fieldLabel = document.createElement("label");
          fieldLabel.textContent = element.label;
          fieldLabel.setAttribute("for", element.element_id);
          fieldDiv.append(fieldLabel);

          const fieldInput = document.createElement(element.element_type);
          fieldInput.textContent = element.textContent;
          fieldInput.setAttribute("type", element.input_type);
          fieldInput.setAttribute("id", element.element_id);
          fieldInput.setAttribute("placeholder", element.text_placeholder);
          fieldInput.setAttribute(element.required, element.required);
          if (element.value) {
            fieldInput.value = element.value;
          }
          fieldInput.style.cursor = element.cursor_style;
          fieldDiv.append(fieldInput);

          if (element.element_type === "select") {
            element.select_options.forEach((item) => {
              const option = document.createElement("option");
              option.setAttribute("value", item);
              option.textContent = item;
              fieldInput.append(option);
              if (item === taskObject.projectName) {
                option.setAttribute("selected", "selected");
              }
            });
          }
        });

        const submitTaskButton = document.createElement("button");
        submitTaskButton.setAttribute("type", "submit");
        submitTaskButton.textContent = "Save";
        editTaskDialogForm.append(submitTaskButton);

        const closeTaskDialogDiv = document.createElement("div");
        closeTaskDialogDiv.classList.add("close-task-dialog");
        editTaskDialogForm.append(closeTaskDialogDiv);

        const closeTaskDialogSpan = document.createElement("span");
        closeTaskDialogSpan.classList.add("material-symbols-outlined");
        closeTaskDialogSpan.textContent = "close";
        closeTaskDialogDiv.append(closeTaskDialogSpan);

        // Add close animation on Save and Close
        handleCloseAnimation(
          editTaskDialogForm,
          editTaskDialog,
          "submit",
          editTaskDialogForm,
        );
        handleCloseAnimation(
          closeTaskDialogSpan,
          editTaskDialog,
          "click",
          editTaskDialogForm,
        );
      }
    }

    // Close animation on ESC
    function addEscEvenListener() {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          const openDialog = document.querySelector("dialog[open]");
          if (openDialog) {
            closeDialog(openDialog);
          }
        }
      });
    }

    // Close animation handler
    function handleCloseAnimation(eventElement, dialog, eventType, form) {
      eventElement.addEventListener(eventType, (event) => {
        event.preventDefault();

        const projectName = document.querySelector("#project-name");
        projectName.value = "";

        const taskTitle = document.querySelector("#task-title");
        taskTitle.value = "";

        const taskNotes = document.querySelector("#task-notes");
        taskNotes.value = "";

        // form.reset();
        closeDialog(dialog);
      });
    }

    // Close dialog
    function closeDialog(dialog) {
      dialog.classList.add("hidden");
      dialog.classList.remove("displayed");
      dialog.addEventListener("transitionend", function handleTransitionEnd() {
        dialog.close();
        dialog.removeEventListener("transitionend", handleTransitionEnd);
      });
    }

    return {
      newProjectDialogHandler,
      newTaskDialogHandler,
      addEscEvenListener,
      createTaskDeleteDialog,
      createProjectDeleteDialog,
      handleCloseAnimation,
      editTaskDialogHandler,
    };
  })();

  // Handler for left div
  const createLeftDiv = (function () {
    // Create layout structure
    function createStructure() {
      const mainDiv = document.querySelector(".main");
      const leftDiv = document.createElement("div");
      leftDiv.classList.add("left");
      mainDiv.append(leftDiv);

      const leftFirstDiv = document.createElement("div");
      leftFirstDiv.classList.add("left-first-section");
      leftFirstDiv.dataset.active = "Today";

      leftDiv.append(leftFirstDiv);

      const firstSectionLabel = document.createElement("p");
      firstSectionLabel.textContent = "Tasks";
      leftFirstDiv.append(firstSectionLabel);

      const firstSectionList = document.createElement("ul");
      firstSectionList.classList.add("views");
      leftFirstDiv.append(firstSectionList);

      const firstSectionLineItems = [
        {
          element_type: "li",
          element_class: "task-filter",
          dataset_active: "true",
          child_elements: [
            {
              element_type: "div",
              element_class: "image",
              element_innerHtml:
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-today-outline</title><path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.89 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19M7 11H12V16H7" /></svg>',
            },
            {
              element_type: "p",
              element_textContent: "Today",
            },
          ],
          function: "getTodayTasks",
        },
        {
          element_type: "li",
          element_class: "task-filter",
          dataset_active: "false",
          child_elements: [
            {
              element_type: "div",
              element_class: "image",
              element_innerHtml:
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-start-outline</title><path d="M13 18L9 14V17H4V14H2V22H4V19H9V22L13 18M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V12H5V9H19V19H14.8L12.8 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M5 7V5H19V7H5Z" /></svg>',
            },
            {
              element_type: "p",
              element_textContent: "Tomorrow",
            },
          ],
          function: "getTomorrowTasks",
        },
        {
          element_type: "li",
          element_class: "task-filter",
          dataset_active: "false",
          child_elements: [
            {
              element_type: "div",
              element_class: "image",
              element_innerHtml:
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-month-outline</title><path d="M7 11H9V13H7V11M21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5M5 7H19V5H5V7M19 19V9H5V19H19M15 13V11H17V13H15M11 13V11H13V13H11M7 15H9V17H7V15M15 17V15H17V17H15M11 17V15H13V17H11Z" /></svg>',
            },
            {
              element_type: "p",
              element_textContent: "All",
            },
          ],
          function: "getAllTasks",
        },
      ];

      firstSectionLineItems.forEach((element) => {
        const lineItem = document.createElement(element.element_type);
        lineItem.classList.add(element.element_class);
        lineItem.dataset.active = element.dataset_active;
        firstSectionList.append(lineItem);
        if (element.child_elements) {
          element.child_elements.forEach((child_element) => {
            const lineItemChild = document.createElement(
              child_element.element_type,
            );
            lineItemChild.classList.add(child_element.element_class);
            if (child_element.element_innerHtml) {
              lineItemChild.innerHTML = `${child_element.element_innerHtml}`;
            }
            if (child_element.element_textContent) {
              lineItemChild.textContent = child_element.element_textContent;
            }
            lineItem.append(lineItemChild);
          });
        }
        const tasksFunction = TaskModule[element.function];
        lineItem.addEventListener("click", () => {
          DOMModule.createRightDiv.createTasks(
            TaskModule.getProjectTasks(
              TaskModule.getActiveProject(),
              tasksFunction(),
            ),
          );

          const rightFirstHeader = document.querySelector(
            ".right-first-header",
          );
          rightFirstHeader.textContent =
            TaskModule.getActiveView().charAt(0).toUpperCase() +
            TaskModule.getActiveView().slice(1);
          if (TaskModule.getActiveProject()) {
            rightFirstHeader.textContent += ` - ${TaskModule.getActiveProject()}`;
          }
        });
      });

      const animationDiv = document.createElement("div");
      animationDiv.classList.add("task-animation", "start-today");
      firstSectionList.append(animationDiv);

      const leftSecondDiv = document.createElement("div");
      leftSecondDiv.classList.add("left-second-section");
      leftDiv.append(leftSecondDiv);

      const secondSectionLabel = document.createElement("p");
      secondSectionLabel.textContent = "Projects";
      leftSecondDiv.append(secondSectionLabel);

      const secondSectionList = document.createElement("ul");
      secondSectionList.classList.add("second-section-list");
      leftSecondDiv.append(secondSectionList);

      // Update data-active property on .task-filer and on parent .left-first-section
      Array.from(document.getElementsByClassName("task-filter")).forEach(
        (item) => {
          item.onclick = () => {
            // leftFirstDiv.dataset.active = item.textContent;
            Array.from(document.getElementsByClassName("task-filter")).forEach(
              (item2) => {
                if (item === item2) {
                  item2.dataset.active = "true";
                } else {
                  item2.dataset.active = "false";
                }
              },
            );
          };
        },
      );
    }

    // Render projects in .second-section-list
    function createProjects(projects) {
      const projectLineItems = document.querySelectorAll(".project");
      if (projectLineItems) {
        projectLineItems.forEach((item) => {
          item.remove();
        });
      }

      projects.forEach((element) => {
        const secondSectionList = document.querySelector(
          ".second-section-list",
        );
        const projectLineItem = document.createElement("li");
        projectLineItem.classList.add("project");
        projectLineItem.dataset.active = element.active;
        secondSectionList.append(projectLineItem);

        // const circle = document.createElement('div');
        // circle.classList.add('circle');
        // circle.style.backgroundColor = element.color;
        // projectLineItem.append(circle);
        const icon = document.createElement("div");
        icon.classList.add("icon");
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="0.5" stroke="var(--border-dark)">
                <title>checkbox-multiple-blank-circle</title>
                <path d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10A8,8 0 0,0 14,2M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z"/>
                </svg>`;
        // icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>leaf</title><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>`;
        // icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>leaf</title><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>`;

        icon.style.fill = element.color;
        projectLineItem.append(icon);

        const projectLineItemName = document.createElement("div");
        projectLineItemName.textContent = element.name;
        projectLineItem.append(projectLineItemName);

        const projectLineItemDeleteButton = document.createElement("div");
        projectLineItemDeleteButton.classList.add("delete-project-button");
        projectLineItemDeleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete-outline</title><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" /></svg>`;
        projectLineItem.append(projectLineItemDeleteButton);

        projectLineItemDeleteButton.addEventListener("click", () => {
          const confirmProjectDeleteDialog =
            document.querySelector(".project-delete");
          const confirmProjectDeleteForm = document.querySelector(
            ".project-delete > form",
          );
          confirmProjectDeleteDialog.showModal();
          confirmProjectDeleteDialog.classList.remove("hidden");
          confirmProjectDeleteDialog.classList.add("displayed");

          const confirmProjectDeleteButton = document.querySelector(
            '.project-delete > form > button[type="submit"]',
          );
          const cancelProjectDeleteButton = document.querySelector(
            '.project-delete > form > button[type="close"]',
          );
          confirmProjectDeleteButton.addEventListener("click", () => {
            // TaskModule.deleteTask(element.id);
            // DOMModule.createDialogs.handleCloseAnimation(confirmTaskDeleteForm, confirmTaskDeleteDialog, 'submit', confirmTaskDeleteForm);
            // DOMModule.createRightDiv.createTasks(TaskModule.getProjectTasks(TaskModule.getActiveProject(), TaskModule.getTasksFromActiveView()));
            ProjectModule.deleteProject(element.id);
            DOMModule.createDialogs.handleCloseAnimation(
              confirmProjectDeleteForm,
              confirmProjectDeleteDialog,
              "submit",
              confirmProjectDeleteForm,
            );
            DOMModule.createLeftDiv.createProjects(
              ProjectModule.getProjectObjects(),
            );
            TaskModule.deleteTaskByProjectId(element.id);

            if (TaskModule.getActiveProject() === element.name) {
              TaskModule.changeActiveProject("");
              const rightFirstHeader = document.querySelector(
                ".right-first-header",
              );
              rightFirstHeader.textContent =
                TaskModule.getActiveView().charAt(0).toUpperCase() +
                TaskModule.getActiveView().slice(1);
            }
            // DOMModule.createDialogs.newTaskDialogHandler();
            DOMModule.createRightDiv.createTasks(
              TaskModule.getProjectTasks(
                TaskModule.getActiveProject(),
                TaskModule.getTasksFromActiveView(),
              ),
            );
          });

          cancelProjectDeleteButton.addEventListener("click", () => {
            DOMModule.createDialogs.handleCloseAnimation(
              confirmProjectDeleteForm,
              confirmProjectDeleteDialog,
              "submit",
              confirmProjectDeleteForm,
            );
          });
        });

        projectLineItemDeleteButton.addEventListener("mouseover", () => {
          projectLineItemDeleteButton.classList.add("hovered");
          projectLineItem.classList.add("hovered-delete");
        });

        projectLineItemDeleteButton.addEventListener("mouseleave", () => {
          projectLineItemDeleteButton.classList.remove("hovered");
          projectLineItem.classList.remove("hovered-delete");
        });

        projectLineItem.addEventListener("click", () => {
          const deleteHovered = document.querySelector(
            ".delete-project-button.hovered",
          );
          if (!deleteHovered) {
            if (
              TaskModule.getActiveProject() === projectLineItemName.textContent
            ) {
              TaskModule.changeActiveProject("");
            } else {
              TaskModule.changeActiveProject(projectLineItemName.textContent);
            }
            DOMModule.createRightDiv.createTasks(
              TaskModule.getProjectTasks(
                TaskModule.getActiveProject(),
                TaskModule.getTasksFromActiveView(),
              ),
            );

            const rightFirstHeader = document.querySelector(
              ".right-first-header",
            );
            rightFirstHeader.textContent =
              TaskModule.getActiveView().charAt(0).toUpperCase() +
              TaskModule.getActiveView().slice(1);
            if (TaskModule.getActiveProject()) {
              rightFirstHeader.textContent += ` - ${TaskModule.getActiveProject()}`;
            }
          }
        });
      });

      const existingAnimationDiv2 = document.querySelector(
        ".second-section-list > .task-animation",
      );
      if (existingAnimationDiv2) {
        existingAnimationDiv2.remove();
      }

      const secondSectionList = document.querySelector(".second-section-list");
      const animationDiv2 = document.createElement("div");
      animationDiv2.classList.add("task-animation", "start-first");
      secondSectionList.append(animationDiv2);

      // Update data-active property on .project
      Array.from(document.getElementsByClassName("project")).forEach((item) => {
        item.onclick = () => {
          const deleteHovered = document.querySelector(
            ".delete-project-button.hovered",
          );
          if (!deleteHovered) {
            Array.from(document.getElementsByClassName("project")).forEach(
              (item2) => {
                if (item === item2) {
                  if (item.dataset.active == "true") {
                    const task_animation =
                      document.querySelector(".start-first");
                    task_animation.style.opacity = "0";
                    item2.classList.remove("font-accent");
                    setTimeout(() => {
                      item2.dataset.active = "false";
                      task_animation.style.opacity = "1";
                    }, 300);
                  } else {
                    item2.dataset.active = "true";
                    item2.classList.add("font-accent");
                  }
                } else {
                  item2.dataset.active = "false";
                  item2.classList.remove("font-accent");
                }
              },
            );
          }
        };
      });
    }

    return {
      createStructure,
      createProjects,
    };
  })();

  // Handler for right div
  const createRightDiv = (function () {
    // Create layout structure
    function createStructure() {
      const mainDiv = document.querySelector(".main");
      const rightDiv = document.createElement("div");
      rightDiv.classList.add("right");
      mainDiv.append(rightDiv);

      const rightFirstHeader = document.createElement("div");
      rightFirstHeader.classList.add("right-first-header");
      rightFirstHeader.textContent = "All";
      rightDiv.append(rightFirstHeader);

      const rightFirstDiv = document.createElement("div");
      rightFirstDiv.classList.add("right-first-section");
      rightDiv.append(rightFirstDiv);
    }

    // Render tasks
    function createTasks(tasks) {
      const taskLineItems = document.querySelectorAll(".task, .task-divider");
      const filler = document.querySelector(".no-tasks-filler");
      if (filler) {
        filler.remove();
      }
      if (taskLineItems) {
        taskLineItems.forEach((item) => {
          item.remove();
        });
      }

      let counter = 0;
      let sub_counter = 0;

      if (tasks.length === 0) {
        const rightFirstSection = document.querySelector(
          ".right-first-section",
        );
        const filler = document.createElement("div");
        filler.classList.add("no-tasks-filler");
        filler.textContent = `Seems like you don't have any tasks here! Whether it is good or bad, only time will tell...`;
        rightFirstSection.append(filler);
      }

      tasks.forEach((element) => {
        const rightFirstSection = document.querySelector(
          ".right-first-section",
        );
        const taskLineItem = document.createElement("div");
        taskLineItem.classList.add("task");
        taskLineItem.classList.add("hidden");
        rightFirstSection.append(taskLineItem);

        const taskLineItemLeftSection = document.createElement("div");
        taskLineItemLeftSection.classList.add("task-left-section");
        if (element.completed === "true") {
          taskLineItemLeftSection.classList.add("checked");
        } else {
          taskLineItemLeftSection.classList.add("unchecked");
        }
        taskLineItemLeftSection.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>check-circle-outline</title>
                <!-- Outer circle -->
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="0.5" fill="none" />
                
                <!-- Checkmark path -->
                <path d="M7,13.5 L10,16.5 L17,9.5" stroke="currentColor" stroke-width="0.5" fill="none" />
                </svg>`;

        taskLineItem.addEventListener("click", () => {
          if (taskLineItemLeftSection.classList.contains("unchecked")) {
            taskLineItemLeftSection.classList.remove("unchecked");
            taskLineItemLeftSection.classList.add("checked");
            // taskLineItem.style.background = 'blue';

            element.completed = "true";
          } else {
            taskLineItemLeftSection.classList.remove("checked");
            taskLineItemLeftSection.classList.add("unchecked");
            element.completed = "false";
          }
          deleteTaskFromLocalStorage(element);
          saveTaskToLocalStorage(element);
        });

        taskLineItem.append(taskLineItemLeftSection);

        const taskLineItemRightSection = document.createElement("div");
        taskLineItemRightSection.classList.add("task-right-section");

        // const afterElement = document.createElement('div');
        // afterElement.classList.add('hover-effect');
        // taskLineItemRightSection.append(afterElement);
        // afterElement.textContent = element.notes;

        // if (afterElement.textContent !== '') {
        //     taskLineItemRightSection.addEventListener('mouseover', () => {
        //         afterElement.style.opacity = "1";
        //         taskLineItemRightSection.addEventListener('mouseout', () => {
        //             afterElement.style.opacity = "0";
        //         })
        //     })
        // }

        taskLineItem.append(taskLineItemRightSection);

        const taskLineItemDivider = document.createElement("div");
        taskLineItemDivider.classList.add("task-divider");
        taskLineItemDivider.classList.add("hidden");
        rightFirstSection.append(taskLineItemDivider);

        const taskFieldsTemplate = [
          {
            div_class: "task-project",
            child_elements: [
              {
                div_class: "task-project-field",
                textContent: element.projectName,
                color: element.projectColor,
              },
            ],
          },
          {
            div_class: "task-title-field",
            textContent: element.title,
          },
          {
            div_class: "task-notes-field",
            textContent: element.notes,
          },
          // {
          //     div_class: 'task-priority-field',
          //     textContent: element.priority,
          // },
          {
            div_class: "task-date-field",
            textContent: format(parseISO(element.date), "EEE, do MMM"),
          },
          {
            div_class: "task-delete-button",
            innerHTML: `<span class="material-symbols-outlined">close</span>`,
          },
          {
            div_class: "task-edit-button",
            innerHTML: `<span class="material-symbols-outlined">edit</span>`,
          },
        ];

        taskFieldsTemplate.forEach((field) => {
          const taskField = document.createElement("div");
          taskField.classList.add(field.div_class);
          taskField.classList.add("hidden");
          if (field.textContent) {
            taskField.textContent = field.textContent;
          }
          if (field.innerHTML) {
            taskField.innerHTML = field.innerHTML;
          }
          if (field.div_class === "task-delete-button") {
            taskField.addEventListener("click", () => {
              const confirmTaskDeleteDialog =
                document.querySelector(".task-delete");
              const confirmTaskDeleteForm = document.querySelector(
                ".task-delete > form",
              );
              confirmTaskDeleteDialog.showModal();
              confirmTaskDeleteDialog.classList.remove("hidden");
              confirmTaskDeleteDialog.classList.add("displayed");

              const confirmTaskDeleteButton = document.querySelector(
                '.task-delete > form > button[type="submit"]',
              );
              const cancelTaskDeleteButton = document.querySelector(
                '.task-delete > form > button[type="close"]',
              );

              confirmTaskDeleteButton.addEventListener("click", () => {
                TaskModule.deleteTaskById(element.id);
                DOMModule.createDialogs.handleCloseAnimation(
                  confirmTaskDeleteForm,
                  confirmTaskDeleteDialog,
                  "submit",
                  confirmTaskDeleteForm,
                );
                DOMModule.createRightDiv.createTasks(
                  TaskModule.getProjectTasks(
                    TaskModule.getActiveProject(),
                    TaskModule.getTasksFromActiveView(),
                  ),
                );
              });

              function handleCancelTaskDelete() {
                DOMModule.createDialogs.handleCloseAnimation(
                  confirmTaskDeleteForm,
                  confirmTaskDeleteDialog,
                  "submit",
                  confirmTaskDeleteForm,
                );
                cancelTaskDeleteButton.removeEventListener(
                  "click",
                  handleCancelTaskDelete,
                );
              }

              cancelTaskDeleteButton.addEventListener(
                "click",
                handleCancelTaskDelete,
              );
            });
          }

          if (field.div_class == "task-edit-button") {
            taskField.addEventListener("click", () => {
              DOMModule.createDialogs.editTaskDialogHandler(element.id);
              const editTaskDialog = document.querySelector(".edit-task");
              editTaskDialog.showModal();
              editTaskDialog.classList.add("displayed");
              editTaskDialog.classList.remove("hidden");
            });
          }

          taskField.style.backgroundColor = field.color;
          taskLineItemRightSection.append(taskField);
          if (field.child_elements) {
            field.child_elements.forEach((child_element) => {
              const child_div = document.createElement("div");
              child_div.classList.add(child_element.div_class);
              child_div.textContent = child_element.textContent;
              child_div.style.color = child_element.color;
              child_div.style.borderColor = child_element.color;
              taskField.append(child_div);
            });
          }
          setTimeout(() => {
            taskField.classList.remove("hidden");
          }, 20 * sub_counter);
          sub_counter += 1;
        });
        setTimeout(() => {
          taskLineItem.classList.remove("hidden");
        }, 80 * counter);
        counter += 1;

        setTimeout(() => {
          taskLineItemDivider.classList.remove("hidden");
        }, 100 * counter);
      });
    }

    return {
      createStructure,
      createTasks,
    };
  })();

  const createFooterDiv = (function () {
    function createStructure() {
      const rightDiv = document.querySelector(".right");
      const footerDiv = document.createElement("div");
      footerDiv.classList.add("footer");
      rightDiv.append(footerDiv);

      const footerRightDiv = document.createElement("div");
      footerRightDiv.classList.add("footer-right");
      footerDiv.append(footerRightDiv);
    }

    function createButtons() {
      const leftSecondSection = document.querySelector(".left-second-section");
      const footerRightDiv = document.querySelector(".footer-right");

      const createProjectButton = document.createElement("div");
      createProjectButton.classList.add("create-project");
      leftSecondSection.append(createProjectButton);
      createProjectButton.addEventListener("click", () => {
        const newProjectDialog = document.querySelector(".new-project");
        newProjectDialog.showModal();
        newProjectDialog.classList.add("displayed");
        newProjectDialog.classList.remove("hidden");
      });

      const createProjectButtonIcon = document.createElement("div");
      createProjectButtonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;
      createProjectButton.append(createProjectButtonIcon);

      const createProjectButtonLabel = document.createElement("div");
      createProjectButtonLabel.textContent = "Add Project";
      createProjectButton.append(createProjectButtonLabel);

      const createTaskButton = document.createElement("div");
      createTaskButton.classList.add("create-task");
      footerRightDiv.append(createTaskButton);

      createTaskButton.addEventListener("click", () => {
        const newTaskDialog = document.querySelector(".new-task");
        newTaskDialog.showModal();
        newTaskDialog.classList.add("displayed");
        newTaskDialog.classList.remove("hidden");
      });

      const createTaskButtonContainer = document.createElement("div");
      createTaskButtonContainer.classList.add("create-task-container");
      createTaskButton.append(createTaskButtonContainer);

      const createTaskButtonIcon = document.createElement("div");
      createTaskButtonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;
      createTaskButtonContainer.append(createTaskButtonIcon);

      const createTaskButtonLabel = document.createElement("div");
      createTaskButtonLabel.textContent = "Add Task";
      createTaskButtonContainer.append(createTaskButtonLabel);
    }
    return {
      createStructure,
      createButtons,
    };
  })();

  return {
    createMainDiv,
    createDialogs,
    createLeftDiv,
    createRightDiv,
    createFooterDiv,
  };
})();
