use day_01::part2;
use miette::Context;

#[tracing::instrument]
fn main() -> miette::Result<()> {
    tracing_subscriber::fmt::init();

    let file = include_str!("../../input.txt");
    let result = part2(file).context("solve part 2")?;
    println!("{}", result);
    Ok(())
}
