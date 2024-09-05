import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task.status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  //get all tasks
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  //get task by id
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  //create task
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  //delete a task
  async deleteTask(id: string, user: User): Promise<void> {
    const found = await this.getTaskById(id, user);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.delete(found.id);
  }

  //update task status
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
// private tasks: Task[] = [];
// //get all tasks
// getAllTasks(): Task[] {
//   return this.tasks;
// }
// // get all tasks with filters
// getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
//   const { status, search } = filterDto;
//   let tasks = this.getAllTasks();
//   if (status) {
//     tasks = tasks.filter((task) => task.status === status);
//   }
//   if (search) {
//     tasks = tasks.filter((task) => {
//       if (task.title.includes(search) || task.description.includes(search)) {
//         return true;
//       }
//       return false;
//     });
//   }
//   return tasks;
// }
// //create task
// createTasks(createTaskDto: CreateTaskDto): Task {
//   const { title, description } = createTaskDto;
//   const task = {
//     id: uuid(),
//     title,
//     description,
//     status: TaskStatus.OPEN,
//   };
//   this.tasks.push(task);
//   return task;
// }
// // get task by ID
// getTaskById(id: string): Task {
//   const found = this.tasks.find((task) => task.id === id);
//   if (!found) {
//     throw new NotFoundException(`Task with ID "${id}" not found`);
//   }
//   return found;
// }
// //delete a task by ID
// deleteTask(id: string): void {
//   const found = this.getTaskById(id);
//   this.tasks = this.tasks.filter((task) => task.id !== found.id);
// }
// // update task status
// updateTaskStatus(id: string, status: TaskStatus) {
//   const task = this.getTaskById(id);
//   task.status = status;
//   return task;
// }
