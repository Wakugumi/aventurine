# Extending with a new provider

- Create `strategies/mycloud.strategy.ts` implementing `StorageStrategy`.
- Add a new enum value in `StorageDriver`.
- Expand types with `MyCloudOptions` and update `DriverOptionsMap`.
- Update `validateOptions()` with a DTO for the new options.
- Add a case in `strategyFactory()`.
