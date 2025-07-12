import { PrismaClient } from "@prisma/client";
import { profileRepository } from "../profileRepository";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.profile.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Profile Repository", () => {
  it("creates a profile", async () => {
    const data = { name: "Test Profile", currency: "USD" };
    const profile = await profileRepository.create(data);
    expect(profile).toHaveProperty("id");
    expect(profile.name).toBe(data.name);
  });

  it("fetches all profiles", async () => {
    await profileRepository.create({ name: "P1", currency: "USD" });
    await profileRepository.create({ name: "P2", currency: "USD" });
    const profiles = await profileRepository.findAll();
    expect(profiles.length).toBe(2);
  });

  it("fetches by id", async () => {
    const p = await profileRepository.create({ name: "One", currency: "USD" });
    const found = await profileRepository.findById(p.id);
    expect(found?.name).toBe("One");
  });

  it("updates a profile", async () => {
    const p = await profileRepository.create({ name: "Old", currency: "USD" });
    const updated = await profileRepository.update(p.id, { name: "New" });
    expect(updated.name).toBe("New");
  });

  it("deletes a profile", async () => {
    const p = await profileRepository.create({ name: "Temp", currency: "USD" });
    await profileRepository.delete(p.id);
    const shouldBeNull = await profileRepository.findById(p.id);
    expect(shouldBeNull).toBeNull();
  });
});
