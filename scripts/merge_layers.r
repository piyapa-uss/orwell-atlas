library(tidyverse)
library(readxl)

# --- Load data ---
income <- read_csv("data_raw/income_2023_clean.csv")
rent   <- read_csv("data_raw/rent_2025_clean.csv")
house  <- read_csv("data_raw/house_price_2026_clean.csv")
imd    <- read_csv("data_raw/imd_2019_clean.csv")

# --- Clean data ---
rent <- rent %>%
  rename(rent_monthly = rent_montly)

imd <- imd %>%
  rename(
    code = `Local Authority District code (2019)`,
    borough = `Local Authority District name (2019)`,
    income_deprivation = `Income deprivation- Average score`
  )

rent <- rent %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames"
    )
  )

house <- house %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames",
      "City of Westminster" = "Westminster"
    )
  )

imd <- imd %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames"
    )
  )

# Calculate monthly income
income <- income %>%
  mutate(income_monthly = income_annual / 12)

# --- Merge ---
final_df <- income %>%
  left_join(rent,  by = "borough") %>%
  left_join(house, by = c("code", "borough")) %>%
  left_join(imd,   by = c("code", "borough")) %>%
  mutate(
    affordability = rent_monthly / income_monthly
  )

glimpse(final_df)

final_df %>%
  summarise(
    missing_rent = sum(is.na(rent_monthly)),
    missing_house = sum(is.na(house_price)),
    missing_imd = sum(is.na(income_deprivation)),
    missing_afford = sum(is.na(affordability))
  )

# --- Export ---
write_csv(final_df, "data_raw/final_london_cost_layers.csv")

# --- Join shapefile---
library(sf)

borough_sf <- st_read("data_raw/London_Borough_Excluding_MHW.shp")
names(borough_sf)

# --- Rename column---
borough_sf <- borough_sf %>%
  rename(
    code = GSS_CODE,
    borough = NAME
  )
setdiff(final_df$borough, borough_sf$borough)
setdiff(borough_sf$borough, final_df$borough)

borough_sf <- borough_sf %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames"
    )
  )

setdiff(final_df$borough, borough_sf$borough)
setdiff(borough_sf$borough, final_df$borough)

# --- Join with shapefile ---
map_df <- borough_sf %>%
  left_join(final_df, by = c("code", "borough"))

map_df %>%
  st_drop_geometry() %>%
  summarise(
    missing_afford = sum(is.na(affordability))
  )
# --- change coordinate to web based---
map_df_4326 <- st_transform(map_df, 4326)
st_crs(map_df_4326)
library(tidyverse)
library(readxl)

# --- Load data ---
income <- read_csv("data_raw/income_2023_clean.csv")
rent   <- read_csv("data_raw/rent_2025_clean.csv")
house  <- read_csv("data_raw/house_price_2026_clean.csv")
imd    <- read_csv("data_raw/imd_2019_clean.csv")

# --- Clean data ---
rent <- rent %>%
  rename(rent_monthly = rent_montly)

imd <- imd %>%
  rename(
    code = `Local Authority District code (2019)`,
    borough = `Local Authority District name (2019)`,
    income_deprivation = `Income deprivation- Average score`
  )

rent <- rent %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames"
    )
  )

house <- house %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames",
      "City of Westminster" = "Westminster"
    )
  )

imd <- imd %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames"
    )
  )

# Calculate monthly income
income <- income %>%
  mutate(income_monthly = income_annual / 12)

# --- Merge ---
final_df <- income %>%
  left_join(rent,  by = "borough") %>%
  left_join(house, by = c("code", "borough")) %>%
  left_join(imd,   by = c("code", "borough")) %>%
  mutate(
    affordability = rent_monthly / income_monthly
  )

glimpse(final_df)

final_df %>%
  summarise(
    missing_rent = sum(is.na(rent_monthly)),
    missing_house = sum(is.na(house_price)),
    missing_imd = sum(is.na(income_deprivation)),
    missing_afford = sum(is.na(affordability))
  )

# --- Export ---
write_csv(final_df, "data_raw/final_london_cost_layers.csv")

# --- Join shapefile---
library(sf)

borough_sf <- st_read("data_raw/London_Borough_Excluding_MHW.shp")
names(borough_sf)

# --- Rename column---
borough_sf <- borough_sf %>%
  rename(
    code = GSS_CODE,
    borough = NAME
  )
setdiff(final_df$borough, borough_sf$borough)
setdiff(borough_sf$borough, final_df$borough)

borough_sf <- borough_sf %>%
  mutate(
    borough = recode(
      borough,
      "Kingston upon Thames" = "Kingston-upon-Thames",
      "Richmond upon Thames" = "Richmond-upon-Thames"
    )
  )

setdiff(final_df$borough, borough_sf$borough)
setdiff(borough_sf$borough, final_df$borough)

# --- Join with shapefile ---
map_df <- borough_sf %>%
  left_join(final_df, by = c("code", "borough"))

map_df %>%
  st_drop_geometry() %>%
  summarise(
    missing_afford = sum(is.na(affordability))
  )
# --- change coordinate to web based---
map_df_4326 <- st_transform(map_df, 4326)
st_crs(map_df_4326)

# --- Export web-ready geojson ---
st_write(map_df_4326, "data_raw/london_cost_map.geojson", delete_dsn = TRUE)



