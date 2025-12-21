"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LabsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lab_schema_1 = require("./schemas/lab.schema");
const fs = require("fs");
const path = require("path");
let LabsService = LabsService_1 = class LabsService {
    constructor(labModel) {
        this.labModel = labModel;
        this.logger = new common_1.Logger(LabsService_1.name);
        this.allLabs = [];
    }
    async onModuleInit() {
        await this.loadLabs();
    }
    async loadLabs() {
        try {
            const isProd = process.env.NODE_ENV === 'production';
            const basePath = isProd
                ? path.join(__dirname, 'data')
                : path.join(process.cwd(), 'src', 'labs', 'data');
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
                await this.labModel.updateOne({ labId: lab.labId }, { $setOnInsert: lab }, { upsert: true });
            }
            this.logger.log(`✅ Labs loaded successfully: ${this.allLabs.length}`);
        }
        catch (error) {
            this.logger.error('❌ Failed loading labs', error);
        }
    }
    async findAll() {
        return this.labModel.find({}, { simulation: 0 }).lean();
    }
    async findOne(id) {
        const lab = await this.labModel.findOne({ labId: id }).lean();
        if (!lab)
            throw new common_1.NotFoundException('Lab not found');
        return lab;
    }
    async getTheory(id) {
        const lab = await this.findOne(id);
        return lab.theoryContent;
    }
    async getSimulation(id) {
        const lab = await this.findOne(id);
        return lab.simulation;
    }
    async getQuestions(id) {
        const lab = await this.findOne(id);
        return lab.questions;
    }
};
exports.LabsService = LabsService;
exports.LabsService = LabsService = LabsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lab_schema_1.Lab.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LabsService);
//# sourceMappingURL=labs.service.js.map