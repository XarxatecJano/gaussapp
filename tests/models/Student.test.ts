import {
  Student,
  StudentCreateData,
  StudentUpdateData,
} from "../../src/models/Student";

describe("Student Model", () => {
  const validStudentData = {
    first_name: "Juan",
    last_name: "Pérez",
    second_last_name: "García",
    birth_date: new Date("2000-05-15"),
    school_name: "IES Ejemplo",
  };

  describe("Constructor and Validation", () => {
    it("should create a valid student with all fields", () => {
      const student = new Student(validStudentData);

      expect(student.first_name).toBe("Juan");
      expect(student.last_name).toBe("Pérez");
      expect(student.second_last_name).toBe("García");
      expect(student.birth_date).toEqual(new Date("2000-05-15"));
      expect(student.school_name).toBe("IES Ejemplo");
      expect(student.is_active).toBe(true);
      expect(student.enrollment_date).toBeInstanceOf(Date);
    });

    it("should create a valid student without second_last_name", () => {
      const data = { ...validStudentData };
      const { second_last_name, ...dataWithoutSecondName } = data;

      const student = new Student(dataWithoutSecondName);
      expect(student.second_last_name).toBeUndefined();
    });

    it("should throw error when first_name is missing", () => {
      const data = { ...validStudentData, first_name: "" };

      expect(() => new Student(data)).toThrow("El nombre es obligatorio");
    });

    it("should throw error when last_name is missing", () => {
      const data = { ...validStudentData, last_name: "" };

      expect(() => new Student(data)).toThrow("El apellido es obligatorio");
    });

    it("should throw error when birth_date is missing", () => {
      const data = { ...validStudentData };
      delete (data as any).birth_date;

      expect(() => new Student(data as any)).toThrow(
        "La fecha de nacimiento es obligatoria"
      );
    });

    it("should throw error when school_name is missing", () => {
      const data = { ...validStudentData, school_name: "" };

      expect(() => new Student(data)).toThrow(
        "El nombre del centro educativo es obligatorio"
      );
    });

    it("should throw error when first_name exceeds 100 characters", () => {
      const data = { ...validStudentData, first_name: "a".repeat(101) };

      expect(() => new Student(data)).toThrow(
        "El nombre no puede exceder 100 caracteres"
      );
    });

    it("should throw error when last_name exceeds 100 characters", () => {
      const data = { ...validStudentData, last_name: "a".repeat(101) };

      expect(() => new Student(data)).toThrow(
        "El apellido no puede exceder 100 caracteres"
      );
    });

    it("should throw error when second_last_name exceeds 100 characters", () => {
      const data = { ...validStudentData, second_last_name: "a".repeat(101) };

      expect(() => new Student(data)).toThrow(
        "El segundo apellido no puede exceder 100 caracteres"
      );
    });

    it("should throw error when school_name exceeds 150 characters", () => {
      const data = { ...validStudentData, school_name: "a".repeat(151) };

      expect(() => new Student(data)).toThrow(
        "El nombre del centro educativo no puede exceder 150 caracteres"
      );
    });

    it("should throw error when birth_date is too old (over 100 years)", () => {
      const tooOldDate = new Date();
      tooOldDate.setFullYear(tooOldDate.getFullYear() - 101);
      const data = { ...validStudentData, birth_date: tooOldDate };

      expect(() => new Student(data)).toThrow(
        "La fecha de nacimiento no puede ser anterior a 100 años"
      );
    });

    it("should throw error when birth_date is too recent (under 5 years)", () => {
      const tooRecentDate = new Date();
      tooRecentDate.setFullYear(tooRecentDate.getFullYear() - 3);
      const data = { ...validStudentData, birth_date: tooRecentDate };

      expect(() => new Student(data)).toThrow(
        "El estudiante debe tener al menos 5 años"
      );
    });

    it("should throw error when withdrawal_date is before enrollment_date", () => {
      const enrollmentDate = new Date("2020-09-01");
      const withdrawalDate = new Date("2020-08-01");
      const data = {
        ...validStudentData,
        enrollment_date: enrollmentDate,
        withdrawal_date: withdrawalDate,
      };

      expect(() => new Student(data)).toThrow(
        "La fecha de baja no puede ser anterior a la fecha de inscripción"
      );
    });
  });

  describe("Methods", () => {
    let student: Student;

    beforeEach(() => {
      student = new Student(validStudentData);
    });

    describe("getFullName", () => {
      it("should return full name with all parts", () => {
        expect(student.getFullName()).toBe("Juan Pérez García");
      });

      it("should return full name without second_last_name", () => {
        const data = { ...validStudentData };
        const { second_last_name, ...dataWithoutSecondName } = data;
        const studentWithoutSecondName = new Student(dataWithoutSecondName);

        expect(studentWithoutSecondName.getFullName()).toBe("Juan Pérez");
      });
    });

    describe("getAge", () => {
      it("should calculate correct age", () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 20);
        const studentWithAge = new Student({
          ...validStudentData,
          birth_date: birthDate,
        });

        expect(studentWithAge.getAge()).toBe(20);
      });

      it("should handle birthday not yet reached this year", () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 20);
        birthDate.setMonth(birthDate.getMonth() + 1); // Next month
        const studentWithAge = new Student({
          ...validStudentData,
          birth_date: birthDate,
        });

        expect(studentWithAge.getAge()).toBe(19);
      });
    });

    describe("withdraw", () => {
      it("should mark student as inactive and set withdrawal_date", () => {
        student.withdraw();

        expect(student.is_active).toBe(false);
        expect(student.withdrawal_date).toBeInstanceOf(Date);
        expect(student.withdrawal_date!.getTime()).toBeCloseTo(
          new Date().getTime(),
          -2
        );
      });
    });

    describe("reactivate", () => {
      it("should mark student as active and clear withdrawal_date", () => {
        student.withdraw();
        student.reactivate();

        expect(student.is_active).toBe(true);
        expect(student.withdrawal_date).toBeUndefined();
      });
    });

    describe("update", () => {
      it("should update first_name", () => {
        const updateData: StudentUpdateData = { first_name: "Carlos" };
        student.update(updateData);

        expect(student.first_name).toBe("Carlos");
      });

      it("should update multiple fields", () => {
        const updateData: StudentUpdateData = {
          first_name: "Carlos",
          last_name: "López",
          school_name: "IES Nuevo",
        };
        student.update(updateData);

        expect(student.first_name).toBe("Carlos");
        expect(student.last_name).toBe("López");
        expect(student.school_name).toBe("IES Nuevo");
      });

      it("should trim whitespace from string fields", () => {
        const updateData: StudentUpdateData = {
          first_name: "  Carlos  ",
          last_name: "  López  ",
        };
        student.update(updateData);

        expect(student.first_name).toBe("Carlos");
        expect(student.last_name).toBe("López");
      });

      it("should revalidate after update and throw error for invalid data", () => {
        const updateData: StudentUpdateData = { first_name: "" };

        expect(() => student.update(updateData)).toThrow(
          "El nombre es obligatorio"
        );
      });
    });
  });

  describe("Serialization", () => {
    let student: Student;

    beforeEach(() => {
      student = new Student({
        id: 1,
        ...validStudentData,
        enrollment_date: new Date("2020-09-01"),
        is_active: true,
      });
    });

    describe("toDatabase", () => {
      it("should serialize for database with all fields", () => {
        const dbData = student.toDatabase();

        expect(dbData).toEqual({
          id: 1,
          first_name: "Juan",
          last_name: "Pérez",
          second_last_name: "García",
          birth_date: new Date("2000-05-15"),
          school_name: "IES Ejemplo",
          enrollment_date: new Date("2020-09-01"),
          withdrawal_date: null,
          is_active: true,
        });
      });

      it("should handle null values correctly", () => {
        const studentWithoutSecondName = new Student({
          ...validStudentData,
          second_last_name: undefined,
        });
        const dbData = studentWithoutSecondName.toDatabase();

        expect(dbData.second_last_name).toBeNull();
        expect(dbData.withdrawal_date).toBeNull();
      });
    });

    describe("toJSON", () => {
      it("should serialize for API with calculated fields", () => {
        const jsonData = student.toJSON();

        expect(jsonData).toEqual({
          id: 1,
          first_name: "Juan",
          last_name: "Pérez",
          second_last_name: "García",
          full_name: "Juan Pérez García",
          birth_date: "2000-05-15",
          age: expect.any(Number),
          school_name: "IES Ejemplo",
          enrollment_date: "2020-09-01T00:00:00.000Z",
          withdrawal_date: undefined,
          is_active: true,
        });
      });
    });
  });

  describe("Static Methods", () => {
    describe("fromDatabase", () => {
      it("should create Student from database row", () => {
        const dbRow = {
          id: 1,
          first_name: "Juan",
          last_name: "Pérez",
          second_last_name: "García",
          birth_date: "2000-05-15",
          school_name: "IES Ejemplo",
          enrollment_date: "2020-09-01",
          withdrawal_date: null,
          is_active: true,
        };

        const student = Student.fromDatabase(dbRow);

        expect(student.id).toBe(1);
        expect(student.first_name).toBe("Juan");
        expect(student.birth_date).toEqual(new Date("2000-05-15"));
        expect(student.enrollment_date).toEqual(new Date("2020-09-01"));
        expect(student.withdrawal_date).toBeUndefined();
      });
    });

    describe("fromCreateData", () => {
      it("should create Student from create data", () => {
        const createData: StudentCreateData = {
          first_name: "  Juan  ",
          last_name: "  Pérez  ",
          second_last_name: "  García  ",
          birth_date: new Date("2000-05-15"),
          school_name: "  IES Ejemplo  ",
        };

        const student = Student.fromCreateData(createData);

        expect(student.first_name).toBe("Juan");
        expect(student.last_name).toBe("Pérez");
        expect(student.second_last_name).toBe("García");
        expect(student.school_name).toBe("IES Ejemplo");
        expect(student.id).toBeUndefined();
        expect(student.is_active).toBe(true);
      });

      it("should handle undefined second_last_name", () => {
        const createData: StudentCreateData = {
          first_name: "Juan",
          last_name: "Pérez",
          birth_date: new Date("2000-05-15"),
          school_name: "IES Ejemplo",
        };

        const student = Student.fromCreateData(createData);
        expect(student.second_last_name).toBeUndefined();
      });
    });
  });
});
