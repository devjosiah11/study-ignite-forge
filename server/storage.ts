import {
  users,
  projects,
  files,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type File,
  type UpdateUserProfile,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Mock database for development (fallback when DB is not connected)
let mockUsers: Map<string, User> = new Map();
let mockProjects: Map<string, Project> = new Map();
let mockFiles: Map<string, File> = new Map();

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(userId: string, project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // File operations
  getProjectFiles(projectId: string): Promise<File[]>;
  addFile(projectId: string, file: Partial<File>): Promise<File>;
  deleteFile(id: string): Promise<void>;
}

export class MemoryStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return mockUsers.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(mockUsers.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(mockUsers.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      id: crypto.randomUUID(),
      ...insertUser,
      password: hashedPassword,
      preferredModel: "gpt-4",
      apiKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.set(user.id, user);
    return user;
  }

  async updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User> {
    const user = mockUsers.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    mockUsers.set(id, updatedUser);
    return updatedUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return Array.from(mockProjects.values())
      .filter(project => project.userId === userId)
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return mockProjects.get(id);
  }

  async createProject(userId: string, project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: crypto.randomUUID(),
      userId,
      ...project,
      fileCount: 0,
      imageCount: 0,
      pdfCount: 0,
      queryCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProjects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const project = mockProjects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    mockProjects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    mockProjects.delete(id);
    // Also delete associated files
    Array.from(mockFiles.entries()).forEach(([fileId, file]) => {
      if (file.projectId === id) {
        mockFiles.delete(fileId);
      }
    });
  }

  // File operations
  async getProjectFiles(projectId: string): Promise<File[]> {
    return Array.from(mockFiles.values()).filter(file => file.projectId === projectId);
  }

  async addFile(projectId: string, file: Partial<File>): Promise<File> {
    const newFile: File = {
      id: crypto.randomUUID(),
      projectId,
      name: file.name || "Untitled",
      type: file.type || "document",
      size: file.size || 0,
      url: file.url || null,
      uploadedAt: new Date(),
    };
    mockFiles.set(newFile.id, newFile);
    
    // Update file counts
    const projectFiles = await this.getProjectFiles(projectId);
    const fileCount = projectFiles.length;
    const imageCount = projectFiles.filter(f => f.type === 'image').length;
    const pdfCount = projectFiles.filter(f => f.type === 'pdf').length;
    
    await this.updateProject(projectId, {
      fileCount,
      imageCount,
      pdfCount,
    });
    
    return newFile;
  }

  async deleteFile(id: string): Promise<void> {
    mockFiles.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const { db } = await import("./db");
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.warn("Database not available, using memory storage");
      return memoryStorage.getUser(id);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { db } = await import("./db");
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      return memoryStorage.getUserByEmail(email);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { db } = await import("./db");
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      return memoryStorage.getUserByUsername(username);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const { db } = await import("./db");
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          password: hashedPassword,
        })
        .returning();
      return user;
    } catch (error) {
      return memoryStorage.createUser(insertUser);
    }
  }

  async updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User> {
    try {
      const { db } = await import("./db");
      const [user] = await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      return memoryStorage.updateUserProfile(id, updates);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;
      
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      return memoryStorage.validateUser(email, password);
    }
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    try {
      const { db } = await import("./db");
      return await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.lastAccessed));
    } catch (error) {
      return memoryStorage.getProjects(userId);
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const { db } = await import("./db");
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project;
    } catch (error) {
      return memoryStorage.getProject(id);
    }
  }

  async createProject(userId: string, project: InsertProject): Promise<Project> {
    try {
      const { db } = await import("./db");
      const [newProject] = await db
        .insert(projects)
        .values({
          ...project,
          userId,
        })
        .returning();
      return newProject;
    } catch (error) {
      return memoryStorage.createProject(userId, project);
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const { db } = await import("./db");
      const [project] = await db
        .update(projects)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();
      return project;
    } catch (error) {
      return memoryStorage.updateProject(id, updates);
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const { db } = await import("./db");
      await db.delete(projects).where(eq(projects.id, id));
    } catch (error) {
      return memoryStorage.deleteProject(id);
    }
  }

  // File operations
  async getProjectFiles(projectId: string): Promise<File[]> {
    try {
      const { db } = await import("./db");
      return await db.select().from(files).where(eq(files.projectId, projectId));
    } catch (error) {
      return memoryStorage.getProjectFiles(projectId);
    }
  }

  async addFile(projectId: string, file: Partial<File>): Promise<File> {
    try {
      const { db } = await import("./db");
      const [newFile] = await db
        .insert(files)
        .values({
          ...file,
          projectId,
        })
        .returning();
      
      // Update file counts
      const projectFiles = await this.getProjectFiles(projectId);
      const fileCount = projectFiles.length;
      const imageCount = projectFiles.filter(f => f.type === 'image').length;
      const pdfCount = projectFiles.filter(f => f.type === 'pdf').length;
      
      await this.updateProject(projectId, {
        fileCount,
        imageCount,
        pdfCount,
      });
      
      return newFile;
    } catch (error) {
      return memoryStorage.addFile(projectId, file);
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const { db } = await import("./db");
      await db.delete(files).where(eq(files.id, id));
    } catch (error) {
      return memoryStorage.deleteFile(id);
    }
  }
}

const memoryStorage = new MemoryStorage();
export const storage = new DatabaseStorage();
