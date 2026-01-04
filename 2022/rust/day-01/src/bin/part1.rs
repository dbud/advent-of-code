use day_01::part1;
use miette::Context;

#[tracing::instrument]
fn main() -> miette::Result<()> {
    tracing_subscriber::fmt::init();

    let file = include_str!("../../input.txt");
    let result = part1(file).context("solve part 1")?;
    println!("{}", result);
    Ok(())
}
