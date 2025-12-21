import { Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lab, LabDocument } from './schemas/lab.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LabsService implements OnModuleInit {
  private readonly logger = new Logger(LabsService.name);
  private allLabs: any[] = [];

  constructor(
    @InjectModel(Lab.name)
    private readonly labModel: Model<LabDocument>,
  ) {}

  /**
   * Run AFTER NestJS initializes modules
   * (never do async work in constructor)
   */
  async onModuleInit() {
    await this.loadLabs();
  }

  /**
   * Load labs from JSON files (DEV + PROD safe)
   */
  private async loadLabs() {
    try {
      const isProd = process.env.NODE_ENV === 'production';

      const basePath = isProd
        ? path.join(__dirname, 'data') // dist/labs/data
        : path.join(process.cwd(), 'src', 'labs', 'data'); // src/labs/data

      const schoolLabsPath = path.join(basePath, 'school-labs.json');
      const institutionLabsPath = path.join(basePath, 'institution-labs.json');

      if (!fs.existsSync(schoolLabsPath)) {
        this.logger.error(`Missing file: ${schoolLabsPath}`);
        return;
      }

      if (!fs.existsSync(institutionLabsPath)) {
        this.logger.error(`Missing file: ${institutionLabsPath}`);
        return;
      }

      const schoolLabs = JSON.parse(fs.readFileSync(schoolLabsPath, 'utf8'));
      const institutionLabs = JSON.parse(fs.readFileSync(institutionLabsPath, 'utf8'));

      this.allLabs = [...schoolLabs, ...institutionLabs];

      for (const lab of this.allLabs) {
        await this.labModel.updateOne(
          { labId: lab.labId },
          { $setOnInsert: lab },
          { upsert: true },
        );
      }

      this.logger.log(`✅ Labs loaded successfully: ${this.allLabs.length}`);
    } catch (error) {
      this.logger.error('❌ Failed loading labs', error);
    }
  }

  async findAll() {
    return this.labModel.find({}, { simulation: 0 }).lean();
  }

  async findOne(id: string) {
    const lab = await this.labModel.findOne({ labId: id }).lean();
    if (!lab) throw new NotFoundException('Lab not found');
    return lab;
  }

  async getTheory(id: string) {
    const lab = await this.findOne(id);
    return lab.theoryContent;
  }

  async getSimulation(id: string) {
    const lab = await this.findOne(id);
    return lab.simulation;
  }

  async getQuestions(id: string) {
    const lab = await this.findOne(id);
    return lab.questions;
  }
}
