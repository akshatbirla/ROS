# API.md

> **Rotaract OS — Service & API Specifications**

---

## 📡 Service Interfaces

### 1. Members Service (`features/members/services/membersService.ts`)
- `getMembers(rotaryYearId: string): Promise<Member[]>`
- `getMemberById(id: string): Promise<Member>`
- `createMember(data: CreateMemberInput): Promise<Member>`
- `updateDisciplineScore(id: string, delta: number): Promise<Member>`

### 2. Events Service (`features/events/services/eventsService.ts`)
- `getEvents(rotaryYearId: string): Promise<Event[]>`
- `createEvent(data: CreateEventInput): Promise<Event>`

### 3. Attendance & Advisor Export Service (`features/attendance/services/attendanceService.ts`)
- `getEventAttendance(eventId: string): Promise<AttendanceRecord[]>`
- `recordAttendance(data: RecordAttendanceInput): Promise<void>`
- `generateAdvisorExportSheet(eventId: string): Promise<AdvisorExportRow[]>`

---

## 📄 Advisor Export Row Contract

```typescript
export interface AdvisorExportRow {
  serialNo: number;
  rotaractorName: string;
  yearAndSection: string;
  clubCoordinatorName: string;
  clubCoordinatorGmail: string;
}
```
