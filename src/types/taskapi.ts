export type task = {
  id:number,
  name: string,
  description: string,
  dueDate: Date,
  completed: boolean
}
export type taskCategory = {
  id:string,
  name: string,
  tasks?: task[]
}