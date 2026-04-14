library(readxl)
library(dplyr)
library(stringr)
library(sf)

income_raw <- read_excel(
  "data_raw/income-of-tax-payers.xlsx",
  sheet = "Total Income",
  col_names = FALSE
)

income_clean <- income_raw %>%
  slice(-1, -2, -3) %>%
  select(
    borough = ...2,
    income = ...70
  ) %>%
  mutate(
    income = as.numeric(income),
    borough = recode(
      borough,
      "Kingston-upon-Thames" = "Kingston upon Thames",
      "Richmond-upon-Thames" = "Richmond upon Thames"
    )
  ) %>%
  filter(borough %in% c(
    "Barking and Dagenham","Barnet","Bexley","Brent","Bromley",
    "Camden","City of London","Croydon","Ealing","Enfield","Greenwich",
    "Hackney","Hammersmith and Fulham","Haringey","Harrow","Havering",
    "Hillingdon","Hounslow","Islington","Kensington and Chelsea",
    "Kingston upon Thames","Lambeth","Lewisham","Merton","Newham",
    "Redbridge","Richmond upon Thames","Southwark","Sutton",
    "Tower Hamlets","Waltham Forest","Wandsworth","Westminster"
  ))

boroughs <- st_read("data_raw/London_Borough_Excluding_MHW.shp", quiet = TRUE) %>%
  mutate(borough = NAME)

income_map <- boroughs %>%
  left_join(income_clean, by = "borough")

st_write(
  income_map,
  "public/data/maps/income_borough_2022_23.geojson",
  delete_dsn = TRUE,
  quiet = TRUE
)