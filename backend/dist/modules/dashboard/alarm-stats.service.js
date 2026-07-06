export class AlarmStatsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getActiveAlarmCounter(filters) {
        return this.repo.getActiveAlarmCounter(filters);
    }
    async getAlarmBySeverity(filters) {
        return this.repo.getAlarmBySeverity(filters);
    }
    async getAlarmTrend(interval, filters) {
        return this.repo.getAlarmTrend(interval, filters);
    }
    async getLatestAlarmsTable(limit = 10, filters) {
        return this.repo.getLatestAlarmsTable(limit, filters);
    }
}
