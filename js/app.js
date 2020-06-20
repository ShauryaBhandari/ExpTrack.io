// Storage
const StorageCtrl = (function () {
  return {
    storageItem: function (item) {
      let items = [];
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    clearItemsFromLS: function () {
      localStorage.removeItem("items");
    },
  };
})();
// Items
const ItemCtrl = (() => {
  // alert("test");
  // Item constructor
  const Item = function (id, name, amount, date) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.date = date;
  };
  // Data Structure
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalBudget: 0,
    BudgetLeft: 0,
  };
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, amount, date) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      amount = parseInt(amount);

      //create new addition
      newItem = new Item(ID, name, amount, date);
      data.items.push(newItem);
      return newItem;
    },

    logData: function () {
      return data;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, amount, date) {
      amount = parseInt(amount);
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.amount = amount;
          item.date = date;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      const ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearEverything: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },

    getTotal: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total = total + item.amount;
      });
      data.total = total;
      return data.total;
    },
  };
})();

// UI
const UICtrl = (() => {
  // alert("test");

  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach((item) => {
        html += `
      <tr id="item-${item.id}" class="itemA">
          <th scope="row">${item.id + 1}</th>
          <td>${item.name}</td>
          <td>${item.amount}</td>
          <td>${item.date}</td>
          <td>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil-square"></i>
            </a>
          </td>
        </tr>
        `;
      });
      document.querySelector(".item-list").innerHTML = html;
    },
    getInput: function () {
      return {
        name: document.querySelector("#item-name").value,
        amount: document.querySelector("#item-amount").value,
        date: document.querySelector("#item-date").value,
      };
    },

    addListItem: function (item) {
      const tr = document.createElement("tr");
      tr.id = `item-${item.id}`;
      tr.classList.add("itemA");
      tr.innerHTML = `<th scope="row">${item.id + 1}</th>
      <td>${item.name}</td>
      <td>${item.amount}</td>
      <td>${item.date}</td>
      <td>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil-square"></i>
        </a>
      </td>`;

      document
        .querySelector(".item-list")
        .insertAdjacentElement("beforeend", tr);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(".itemA");

      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <tr id="item-${item.id}" class="itemA">
          <th scope="row">${item.id}</th>
          <td>${item.name}</td>
          <td>${item.amount}</td>
          <td>${item.date}</td>
          <td>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil-square"></i>
            </a>
          </td>
        </tr>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
      UICtrl.clearEditState();
    },
    clearAll: function () {
      document.querySelector("#item-amount").value = "";
      document.querySelector("#item-name").value = "";
      document.querySelector("#item-date").value = "";
    },
    addItemToForm: function () {
      document.querySelector(
        "#item-name"
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        "#item-amount"
      ).value = ItemCtrl.getCurrentItem().amount;
      document.querySelector(
        "#item-date"
      ).value = ItemCtrl.getCurrentItem().date;
      UICtrl.showEditState();
    },
    showTotalAmt: function (total) {
      document.querySelector(".total-amount").textContent = total;
    },
    clearEditState: function (e) {
      UICtrl.clearAll();
      document.querySelector(".update-btn").style.display = "none";
      document.querySelector(".delete-btn").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
      document.querySelector(".add-btn").style.display = "block";
      document.querySelector(".clear-btn").style.display = "block";
    },
    showEditState: function () {
      document.querySelector(".update-btn").style.display = "inline";
      document.querySelector(".delete-btn").style.display = "inline";
      document.querySelector(".back-btn").style.display = "inline";
      document.querySelector(".add-btn").style.display = "none";
      document.querySelector(".clear-btn").style.display = "none";
    },

    itemDelete: function () {
      const currentItem = ItemCtrl.getCurrentItem();
      // delete from DS
      ItemCtrl.deleteItem(currentItem.id);
      //delete from ui
      UICtrl.deleteListItem(currentItem.id);
      const total = ItemCtrl.getTotal();
      UICtrl.showTotalAmt(total);
      UICtrl.clearEditState();

      StorageCtrl.deleteItemFromStorage(currentItem.id);
    },
    clearAllItems: function () {
      ItemCtrl.clearEverything();

      const total = ItemCtrl.getTotal();
      UICtrl.showTotalAmt(total);
      UICtrl.removeItems();
      StorageCtrl.clearItemsFromLS();
      UICtrl.clearEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(".itemA");
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
  };
})();
// App
const AppCtrl = ((ItemCtrl, StorageCtrl, UICtrl) => {
  // Load all event listeners
  const loadEL = function () {
    document.querySelector(".add-btn").addEventListener("click", itemAdd);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
      }
    });
    document
      .querySelector(".item-list")
      .addEventListener("click", itemEditClick);
    document
      .querySelector(".update-btn")
      .addEventListener("click", itemUpdateSubmit);

    document.querySelector(".back-btn").addEventListener("click", (e) => {
      UICtrl.clearEditState();
      e.preventDefault();
    });

    document.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      UICtrl.itemDelete();
    });
    document.querySelector(".clear-btn").addEventListener("click", (e) => {
      e.preventDefault();
      UICtrl.clearAllItems();
    });
    document.querySelector(".clear-btn").addEventListener("click", (e) => {
      const custom = document.querySelector("#custom");
      custom.style.display = "none";
      const yo = document.querySelector("#yo");
      yo.style.display = "none";
      document.querySelector(".hi").style.display = "none";
      e.preventDefault();
    });

    document
      .querySelector(".add-btn")
      .addEventListener("click", function load() {
        const custom = document.querySelector("#custom");
        custom.style.display = "block";
        const yo = document.querySelector("#yo");
        yo.style.display = "block";
      });
    document
      .getElementById("total-budget")
      .addEventListener("keyup", function () {
        const b = document.getElementById("total-budget");
        document.querySelector(".budget").textContent = `${b.value}`;
      });
    document.querySelector(".add-btn").addEventListener(
      "click",
      function addThead() {
        const thead = document.createElement("thead");
        thead.innerHTML = `
    <tr class="hi">
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Amount</th>
          <th scope="col">Date</th>
          <th scope="col"></th>
        </tr>
    `;
        document
          .querySelector(".item-list")
          .insertAdjacentElement("beforeend", thead);
      },
      { once: true }
    );
  };

  itemAdd = function (e) {
    e.preventDefault();
    const input = UICtrl.getInput();

    if (input.name !== "" && input.amount !== "" && input.date !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.amount, input.date);

      UICtrl.addListItem(newItem);
      UICtrl.clearAll();

      const total = ItemCtrl.getTotal();

      UICtrl.showTotalAmt(total);

      // locally store
      StorageCtrl.storageItem(newItem);

      UICtrl.clearAll();
    }
  };
  const itemEditClick = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      const listId = e.target.parentNode.parentNode.parentNode.id;
      const listIdArr = listId.split("-");
      const id = parseInt(listIdArr[1]);
      const ItemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(ItemToEdit);
      UICtrl.addItemToForm();
    }
  };

  const itemUpdateSubmit = function (e) {
    e.preventDefault();
    const input = UICtrl.getInput();
    const updatedItem = ItemCtrl.updateItem(
      input.name,
      input.amount,
      input.date
    );

    UICtrl.updateListItem(updatedItem);
    const total = ItemCtrl.getTotal();
    UICtrl.showTotalAmt(total);

    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
  };
  return {
    // init to load a new version of the application is done
    init: function () {
      // console.log("Test");
      // Set initial state
      UICtrl.clearEditState();
      // AppCtrl.load();
      // fetch items form the data structure
      const items = ItemCtrl.getItems();

      // make the list with items
      UICtrl.populateItemList(items);
      const total = ItemCtrl.getTotal();

      UICtrl.showTotalAmt(total);
      loadEL();
      // const custom = document.querySelector("#custom");
      // custom.style.display = "block";
      // const yo = document.querySelector("#yo");
      // yo.style.display = "block";

      google.charts.load("44", {
        callback: drawBackgroundColor,
        packages: ["corechart"],
      });
      function drawBackgroundColor() {
        //check for Navigation Timing API support
        if (window.performance) {
          // console.info("window.performance works fine on this browser");
        }
        if (performance.navigation.type == 1) {
          // console.info("This page is reloaded");
          custom = document.querySelector("#custom");
          custom.style.display = "block";
          const yo = document.querySelector("#yo");
          yo.style.display = "block";
        } else {
          // console.info("This page is not reloaded");
        }
        let d = [];
        var results = items.filter(function OP(itemsarr) {
          var todayTime = new Date(itemsarr.date);
          var month = todayTime.getMonth() + 1;
          var day = todayTime.getDate();
          var year = todayTime.getFullYear();
          let newDate = month + "/" + day + "/" + year.toString();
          let c = [new Date(newDate), itemsarr.amount];
          d.push(c);
          return c;
        });

        console.log(d);
        var data = new google.visualization.DataTable();
        data.addColumn("date", "Date");
        data.addColumn("number", "Expenditure");

        data.addRows(d);

        var options = {
          hAxis: {
            title: "Date",
          },
          vAxis: {
            title: "Expenditure",
          },
          backgroundColor: "#90b8f8",
        };

        var chart = new google.visualization.LineChart(
          document.getElementById("yo")
        );
        chart.draw(data, options);
      }
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Init app
AppCtrl.init();
