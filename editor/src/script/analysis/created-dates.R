# %% Setup
library(tidyverse)

setwd(rprojroot::find_root("package.json"))

# %% Load
comments <- read_csv("out/comments.csv", show_col_types = FALSE)
comments

topics <- read_csv("out/topics.csv", show_col_types = FALSE)
topics

events <- read_csv("out/events.csv", show_col_types = FALSE)
events

# %% Event labels
# Events less than 14 days apart share one label, so their names do not overlap.
event_labels <- events |>
  arrange(date) |>
  mutate(cluster = cumsum(c(TRUE, diff(date) > 14))) |>
  summarise(
    date = min(date),
    label = paste(display_name, collapse = " / "),
    .by = cluster
  )

# %% Counts
# Stack the two kinds by hand: cumulative x offsets per date. This keeps bar
# thickness in points, so nothing depends on how far apart the dates are.
created_counts <- bind_rows(
  transmute(comments, kind = "Comments", created_date = as_date(created_at)),
  transmute(topics, kind = "Topics", created_date = as_date(created_at))
) |>
  count(kind, created_date) |>
  arrange(created_date, kind) |>
  mutate(xmax = cumsum(n), xmin = xmax - n, .by = created_date)

# One label per date, at the end of the stacked bar: comments / topics.
# complete() fills the kind missing on a given date so the pair always reads
# in the same order.
created_labels <- created_counts |>
  complete(created_date, kind, fill = list(n = 0, xmax = 0)) |>
  summarise(x = max(xmax), label = paste(n, collapse = " + "), .by = created_date)

# %% Plot
created_plot <- ggplot(created_counts, aes(y = created_date, colour = kind)) +
  geom_hline(
    data = events,
    aes(yintercept = date),
    colour = "#8a8984",
    linewidth = 0.4
  ) +
  geom_text(
    data = event_labels,
    aes(y = date, label = label),
    x = Inf,
    hjust = 1,
    vjust = 1.2,
    size = 2.5,
    lineheight = 1.1,
    colour = "#8a8984",
    inherit.aes = FALSE
  ) +
  geom_linerange(aes(xmin = xmin, xmax = xmax), linewidth = 2) +
  geom_text(
    data = created_labels,
    aes(x = x, y = created_date, label = label),
    hjust = -0.2,
    size = 2.5,
    colour = "#52514e",
    inherit.aes = FALSE
  ) +
  scale_colour_manual(
    values = c(Comments = "#2a78d6", Topics = "#eb6834"),
    name = NULL
  ) +
  scale_x_continuous(expand = expansion(mult = c(0, 0.12))) +
  labs(
    title = "Comments and topics created per date, with event dates",
    x = "Count",
    y = "Created date"
  )
created_plot

# %% Save
ggsave(
  "out/created-dates.png",
  created_plot,
  width = 12,
  height = 10,
  dpi = 250,
  device = ragg::agg_png
)
