import Task from '../models/Task'
import { getPagination } from '../libs/getPagination'

export const findAllTasks = async (req, res) => {
  try {
    const { size, page, title } = req.query

    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)
    const data = await Task.paginate(condition, { offset, limit })
    console.log(data)
    res.json({
      totalItems: data.totalDocs,
      tasks: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong retrieving the tasks',
    })
  }
}

export const findAllDoneTasks = async (req, res) => {
  try {
    const allDoneTasks = await Task.find({ done: true })
    res.json(allDoneTasks)
  } catch (error) {
    console.error(error)
  }
}

export const createTask = async (req, res) => {
  if (!req.body.title) {
    return res
      .status(400)
      .send({ message: 'Please enter a title for the task!' })
  }
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false,
    })
    const taskSaved = await newTask.save()
    res.json(taskSaved)
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong creating a tasks',
    })
  }
}

export const findOneTask = async (req, res) => {
  const { id } = req.params
  try {
    const task = await Task.findById(id)

    if (!task)
      return res
        .status(404)
        .json({ message: `Task with id ${id} does not exist` })

    res.json(task)
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error Retrieving Task with id: ${id}`,
    })
  }
}

export const deleteTask = async (req, res) => {
  const { id } = req.params

  try {
    await Task.findByIdAndDelete(id)
    res.json({ message: 'Task was deleted successfully' })
  } catch (error) {
    res.status(500).json({
      message: `Cannot delete task with id: ${id}`,
    })
  }
}

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: 'Task was updated successfully' })
  } catch (error) {
    console.error(error)
  }
}
