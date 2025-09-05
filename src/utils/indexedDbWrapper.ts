// https://www.w3.org/TR/IndexedDB

export type StoreIndexData = {
  name: string
  options?: {
    unique: boolean
    multiEntry: boolean
  }
}

export class IndexedDBWrapper {
  private db!: IDBDatabase
  db_name: string
  db_version: number

  constructor(dbName: string, dbVersion: number) {
    this.db_name = dbName
    this.db_version = dbVersion
  }

  async connect() {
    // indexedDB.deleteDatabase(this.db_name) // to trigger onupgradeneeded
    this.db = await new Promise((resolve, reject) => {
      const reqConnection = indexedDB.open(this.db_name, this.db_version)

      // this onupgradeneeded eventlistener is triggered whenever there are changes on version;
      reqConnection.onupgradeneeded = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Items Table
        const ItemsStore = db.createObjectStore("items", { keyPath: "id" })
        const indexes = [
          { name: "title" },
          { name: "description" },
          { name: "calories" },
        ]

        indexes.forEach(d => {
          ItemsStore.createIndex(`index${d.name}`, d.name);
        })
        // Settings Table
        const SettingsStore = db.createObjectStore("settings", { keyPath: "id", autoIncrement: true })
        SettingsStore.createIndex('daily_calorie_count', 'daily_calorie_count');
        SettingsStore.add({ daily_calorie_count: 2500 })
      }

      reqConnection.onsuccess = async() => {
        console.log("✅ Successfully connected to IndexedDB:", reqConnection.result.name);
        resolve(reqConnection.result)
      }

      reqConnection.onerror = () => {
        console.error("❌ Failed to connect to IndexedDB!");
        reject(reqConnection.error)
      }
    })
  }

  getStoreInstance(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        resolve(store)
      } catch (error) {
        throw new Error(`Store ${storeName} not found!`)
      }
    })
  }

  getItems (storeName: string) {
    return new Promise(async(resolve, reject) => {
      const store = await this.getStoreInstance(storeName, "readonly")
      const res = store.getAll()
      res.onsuccess = () => resolve(res.result)
      res.onerror = () => reject()
    })
  }

  async add(storeName: string, data:any) {
    return new Promise(async (resolve) => {
        const store = await this.getStoreInstance(storeName, "readwrite")
        const request = store.add(data)
        
        request.onsuccess = () => resolve("Successfully Saved!")
        request.onerror = () => { throw new Error(`Error: add function`) }
    })
  }

  async update(storeName:string, data:any) {
    return new Promise(async (resolve) => {
        const store = await this.getStoreInstance(storeName, "readwrite")
        const request = store.put(data)
        request.onsuccess = () => resolve("Successfully updated!")
        request.onerror = () => { throw new Error(`Error: add function`) }
    })
  }

  async delete(storeName: string, id:string) {
    return new Promise(async (resolve) => {
        const store = await this.getStoreInstance(storeName, "readwrite")
        const request = store.delete(id)
        
        request.onsuccess = () => resolve("Successfully Deleted!")
        request.onerror = () => { throw new Error(`Error: delete function`) }
    })
  }
}