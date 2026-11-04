// storages/usersStorage.js
// This class lets us simulate interacting with a database.
class UsersStorage {
  constructor() {
    this.storage = {
      0:{
        id:0, 
        firstName:"daniel",
        lastName: "sass",
        email: "daniels302@gmail.com",
        age: 5,
        bio:"dsdsdsds"
      }
    };
    this.id = 1;
  }

  addUser({ firstName, lastName ,email,age,bio}) {
    const id = this.id;
    this.storage[id] = {id,  firstName, lastName,email,age,bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  searchUser(name, email) {
    if (!name && !email) {
      return [];
    }

    const searchName = name.toLowerCase();
    const searchEmail = email.toLowerCase();

    return Object.values(this.storage).filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const userEmail = user.email.toLowerCase();
      const matchesName = !searchName || fullName.includes(searchName);
      const matchesEmail = !searchEmail || userEmail.includes(searchEmail);

      return matchesName && matchesEmail;
    });
  }



  updateUser(id, { firstName, lastName ,email,age,bio}) {
    this.storage[id] = { id, firstName, lastName,email,age,bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
